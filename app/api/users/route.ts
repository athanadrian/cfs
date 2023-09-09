import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

import { NewUserRequest } from '@app/types';
import startDb from '@lib/db';
import UserModel from '@models/UserModel';
import EmailVerificationToken from '@models/EmailVerificationToken';

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString('hex');
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '8f407b5c4750f7',
      pass: '46625516598ce0',
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;
  transport.sendMail({
    from: process.env.MAILTRAP_FROM_NAME,
    to: newUser.email,
    html: `<h1>Verify your email by clicking this <a href='${verificationUrl}'>link</a></h1>`,
  });
  return NextResponse.json({
    message: 'You need to be verified. Please check your email',
  });
};
