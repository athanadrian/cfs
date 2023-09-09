import { JSX } from 'react';

export type MenuItems = {
  href: string;
  icon: JSX.Element;
  label: string;
};

export type NewUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type EmailVerifyRequest = {
  token: string;
  userId: string;
};

export type ForgetPasswordRequest = {
  email: string;
};

export type UpdatePasswordRequest = {
  token: string;
  userId: string;
  password: string;
};

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  verified: boolean;
}
