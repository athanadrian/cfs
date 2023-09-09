import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import UserModel from '@/app/models/UserModel';
import { UpdatePasswordRequest } from '@/app/types';
import PasswordResetToken from '@/app/models/PasswordResetToken';

export const POST = async (req: Request) => {
  try {
    const { userId, token, password } =
      (await req.json()) as UpdatePasswordRequest;

    if (!isValidObjectId(userId) || !token || !password) {
      return NextResponse.json(
        {
          error: 'Invalid request, userId and token is required!',
        },
        { status: 401 }
      );
    }

    const resetPasswordToken = await PasswordResetToken.findOne({
      user: userId,
    });
    if (!resetPasswordToken) {
      return NextResponse.json(
        {
          error: 'Invalid request, token not found!',
        },
        { status: 401 }
      );
    }

    const isMatched = await resetPasswordToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "Invalid token, token doesn't match!",
        },
        { status: 401 }
      );
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found!!',
        },
        { status: 404 }
      );
    }

    // If we don't want to let the user use the old password
    const isOldPassword = await user.comparePassword(password);
    if (isOldPassword) {
      return NextResponse.json(
        {
          error: "Invalid request, you can't use the previous password!",
        },
        { status: 401 }
      );
    }
    user.password = password;
    user.save();

    await PasswordResetToken.findByIdAndDelete(resetPasswordToken._id);
    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '8f407b5c4750f7',
        pass: '46625516598ce0',
      },
    });

    transport.sendMail({
      from: process.env.MAILTRAP_FROM_NAME,
      to: user.email,
      html: `<h1>Your password is now changed successfully!</h1>`,
    });
    return NextResponse.json(
      { message: 'Your password is now changed successfully!' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not reset password, something went wrong!' },
      { status: 500 }
    );
  }
};
