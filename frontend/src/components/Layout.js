'use client';
import Navbar from './Navbar';

const Layout = ({ children }) => {
 
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />
      <main className="pt-20 px-4 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;



