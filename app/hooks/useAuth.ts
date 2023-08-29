import React from 'react';

interface Auth {
  isAdmin: boolean;
  loading: boolean;
  loggedIn: boolean;
}

const useAuth = () => {
  return { isAdmin: false, loading: false, loggedIn: false };
};

export default useAuth;
