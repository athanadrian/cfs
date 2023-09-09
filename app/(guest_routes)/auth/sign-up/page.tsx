'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@material-tailwind/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Link from 'next/link';

import AuthFormContainer from '@components/AuthFormContainer';
import { formikFilterForm } from '@utils/formikHelpers';

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const SignUp = () => {
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
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(values),
      }).then(async (res) => {
        const { message } = (await res.json()) as { message: string };
        if (res.ok) {
          toast.info(message);
        }
      });
    },
  });

  const formErrors: string[] = formikFilterForm(touched, errors, values);

  type valuesType = keyof typeof values;

  const error = (name: valuesType) =>
    errors[name] && touched[name] ? true : false;

  const { name, email, password } = values;

  return (
    <AuthFormContainer title='Create New Account' onSubmit={handleSubmit}>
      <Input
        name='name'
        label='Name'
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error('name')}
      />
      <Input
        name='email'
        label='Email'
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error('email')}
      />
      <Input
        name='password'
        label='Password'
        type='password'
        value={password}
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
        Sign up
      </Button>
      <div className='flex items-center justify-between'>
        <Link href='/auth/sign-in'>Sign in</Link>
        <Link href='/auth/forgot-password'>Forget password</Link>
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

export default SignUp;
