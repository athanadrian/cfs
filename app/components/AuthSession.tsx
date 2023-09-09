'use client';

import { SessionProvider } from 'next-auth/react';
import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthSession: FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthSession;
