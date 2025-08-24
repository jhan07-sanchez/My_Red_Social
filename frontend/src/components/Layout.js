"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FriendsList from "./FriendsList";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Layout principal */}
      <div className="pt-20 px-4 grid grid-cols-12 gap-4 w-full lg:max-w-7xl lg:mx-auto">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <Sidebar />
        </aside>

        {/* Feed */}
        <main className="col-span-12 md:col-span-6 lg:col-span-7">
          {children}
        </main>

        {/* Lista de amigos solo en desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          <FriendsList />
        </aside>
      </div>
    </div>
  );
};

export default Layout;









