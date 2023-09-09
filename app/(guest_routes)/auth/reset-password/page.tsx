import UpdatePasswordForm from '@/app/components/UpdatePasswordForm';
import startDb from '@/app/lib/db';
import PasswordResetToken from '@/app/models/PasswordResetToken';
import { notFound } from 'next/navigation';
import React, { FC } from 'react';

interface Props {
  searchParams: { token: string; userId: string };
}

const fetchTokenValidation = async (token: string, userId: string) => {
  await startDb();

  const resetToken = await PasswordResetToken.findOne({ user: userId });
  if (!resetToken) return null;
  const isMatched = await resetToken?.compareToken(token);
  if (!isMatched) return null;
  return true;
};

const ResetPassword: FC<Props> = async ({ searchParams }) => {
  const { token, userId } = searchParams;

  if (!token || !userId) return notFound();

  const validatedResetPasswordToken = await fetchTokenValidation(
    token as string,
    userId as string
  );

  if (!validatedResetPasswordToken) return notFound();

  return <UpdatePasswordForm token={token} userId={userId} />;
};

export default ResetPassword;
