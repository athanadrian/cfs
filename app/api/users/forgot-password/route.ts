import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import startDb from '@/app/lib/db';
import UserModel from '@/app/models/UserModel';
import { ForgetPasswordRequest } from '@/app/types';
import PasswordResetToken from '@/app/models/PasswordResetToken';

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email)
      return NextResponse.json({ error: 'Invalid email!' }, { status: 401 });

    await startDb();
    const user = await UserModel.findOne({ email });
    if (!user)
      return NextResponse.json({ error: 'user not found!' }, { status: 404 });

    await PasswordResetToken.deleteOne({ user: user._id });

    const token = crypto.randomBytes(36).toString('hex');
    await PasswordResetToken.create({
      user: user._id,
      token,
    });
    const resetPasswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

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
      html: `<h1>Click on this <a href='${resetPasswordLink}'>link</a> to reset your password!</h1>`,
    });
    return NextResponse.json({ message: 'Please check your email!' });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
