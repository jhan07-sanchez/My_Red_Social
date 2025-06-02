'use client';

import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 bg-gray-100 min-h-screen">{children}</main>
    </>
  );
};

export default Layout;


