import { useSession } from 'next-auth/react';

interface Auth {
  isAdmin: boolean;
  loading: boolean;
  loggedIn: boolean;
}

const useAuth = () => {
  const session = useSession();
  console.log('auth session', session);
  return {
    isAdmin: false,
    loading: session.status === 'loading',
    loggedIn: session.status === 'authenticated',
  };
};

export default useAuth;
