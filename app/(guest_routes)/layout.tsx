import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const GuestLayout: FC<Props> = async ({ children }) => {
  const session = await auth();
  console.log('session', session);
  if (session) return redirect('/');
  return <div>{children}</div>;
};

export default GuestLayout;
