import { NextResponse } from 'next/server';

import startDb from '@lib/db';
import { SignInCredentials } from '@/app/types';
import UserModel from '@models/UserModel';

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignInCredentials;

  if (!email || !password)
    return NextResponse.json({
      error: 'Invalid request, email or password missing!',
    });

  await startDb();
  const user = await UserModel.findOne({ email });
  if (!user)
    return NextResponse.json({
      error: 'Invalid request, email or password mismatch!',
    });

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch)
    return NextResponse.json({
      error: 'Invalid request, email or password mismatch!',
    });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar?.url,
    },
  });
};
