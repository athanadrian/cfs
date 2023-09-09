import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';

import EmailVerificationToken from '@models/EmailVerificationToken';
import UserModel from '@/app/models/UserModel';
import { EmailVerifyRequest } from '@/app/types';

export const POST = async (req: Request) => {
  try {
    const { userId, token } = (await req.json()) as EmailVerifyRequest;

    if (!isValidObjectId(userId || !token)) {
      return NextResponse.json(
        {
          error: 'Invalid request, userId and token is required!',
        },
        { status: 401 }
      );
    }

    const verificationToken = await EmailVerificationToken.findOne({
      user: userId,
    });
    if (!verificationToken) {
      return NextResponse.json(
        {
          error: 'Invalid token',
        },
        { status: 401 }
      );
    }

    const isMatched = await verificationToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "Invalid request, token doesn't match",
        },
        { status: 401 }
      );
    }
    await UserModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

    return NextResponse.json(
      { message: 'Your email is verified' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not verify your email, something went wrong!' },
      { status: 500 }
    );
  }
};
