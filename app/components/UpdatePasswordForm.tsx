'use client';

import React, { FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@material-tailwind/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Link from 'next/link';

import AuthFormContainer from '@components/AuthFormContainer';
import { formikFilterForm } from '@utils/formikHelpers';
import { useRouter } from 'next/navigation';

interface Props {
  token: string;
  userId: string;
}

const initialValues = {
  password: '',
  confirmPassword: '',
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const UpdatePasswordForm: FC<Props> = ({ token, userId }) => {
  const router = useRouter();
  const {
    values,
    isSubmitting,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async ({ password }, action) => {
      action.setSubmitting(true);
      const res = await fetch('/api/users/update-password', {
        method: 'POST',
        body: JSON.stringify({ password, token, userId }),
      });

      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };
      if (res.ok) {
        toast.info(message);
        router.replace('/auth/sign-in');
      }
      if (!res.ok && error) {
        toast.error(error);
      }
      action.setSubmitting(false);
    },
  });

  const formErrors: string[] = formikFilterForm(touched, errors, values);

  type valuesType = keyof typeof values;

  const error = (name: valuesType) =>
    errors[name] && touched[name] ? true : false;

  const { password, confirmPassword } = values;

  return (
    <AuthFormContainer title='Reset password' onSubmit={handleSubmit}>
      <Input
        name='password'
        label='Password'
        type='password'
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error('password')}
      />
      <Input
        name='confirmPassword'
        label='Confirm Password'
        type='password'
        value={confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error('password')}
      />
      <Button
        disabled={isSubmitting}
        color='blue'
        type='submit'
        className='w-full'
      >
        Reset Password
      </Button>
      <div className='flex items-center justify-between'>
        <Link href='/auth/sign-un'>Sign up</Link>
        <Link href='/auth/sign-in'>Sign in</Link>
      </div>
      <div className=''>
        {formErrors.map((value, index) => {
          return (
            <div
              key={index}
              className='space-x-1 flex items-center text-red-500 '
            >
              <XMarkIcon className='w-4 h-4' />
              <p className='text-xs'>{value}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
};

export default UpdatePasswordForm;
