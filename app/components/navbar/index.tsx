import React, { FC } from 'react';
import NavUI from './NavUI';

interface Props {}

const Navbar: FC<Props> = () => {
  return (
    <div>
      <NavUI feeStatements={0} />
    </div>
  );
};

export default Navbar;
