'use client';

import React, { FC, useEffect, useState } from 'react';
import {
  Navbar as MaterialNav,
  IconButton,
  Spinner,
} from '@material-tailwind/react';
import Link from 'next/link';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import FeeIcon from '../FeeIcon';
import ProfileMenu from '../ProfileMenu';
import { MobileNav } from '../MobileNav';
import useAuth from '@hooks/useAuth';

interface Props {
  feeStatements: number;
}

export const menuItems = [
  {
    href: '/profile',
    icon: <UserCircleIcon className='h-4 w-4' />,
    label: 'My Profile',
  },
  {
    href: '/profile/orders',
    icon: <ShoppingBagIcon className='h-4 w-4' />,
    label: 'Orders',
  },
];

const NavUI: FC<Props> = ({ feeStatements }) => {
  const [open, setOpen] = useState(false);
  const { loading, loggedIn } = useAuth();

  useEffect(() => {
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <MaterialNav className='mx-auto max-w-screen-xl px-4 py-2'>
        <div className='flex items-center justify-between text-blue-gray-900'>
          <Link
            href='/'
            className='mr-4 cursor-pointer py-1.5 lg:ml-2 font-semibold'
          >
            Common Fees
          </Link>
          <div className='hidden lg:flex gap-2 items-center'>
            <FeeIcon feeItems={feeStatements} />
            {loggedIn ? (
              <ProfileMenu menuItems={menuItems} />
            ) : loading ? (
              <Spinner />
            ) : (
              <>
                <Link className='px-4 py-1' href='/auth/sign-in'>
                  Sign in
                </Link>
                <Link
                  className='bg-blue-500 text-white px-4 py-1 rounded'
                  href='/auth/sign-up'
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className='lg:hidden flex items-center space-x-2'>
            <FeeIcon feeItems={feeStatements} />

            <IconButton
              variant='text'
              color='blue-gray'
              className='lg:hidden'
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <XMarkIcon className='h-6 w-6' strokeWidth={2} />
              ) : (
                <Bars3Icon className='h-6 w-6' strokeWidth={2} />
              )}
            </IconButton>
          </div>
        </div>
      </MaterialNav>
      <div className='lg:hidden'>
        <MobileNav
          menuItems={menuItems}
          onClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </>
  );
};

export default NavUI;
