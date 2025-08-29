"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FriendsList from "./FriendsList";

const Layout = ({ children }) => (
  <div className="bg-neutral-light dark:bg-neutral-dark min-h-screen">
    <Navbar />
    <div className="flex pt-16">
      <Sidebar />
      <main className="flex-1 min-h-[calc(100vh-4rem)] px-2 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-8 transition-all duration-300">
        {children}
      </main>
      <FriendsList />
    </div>
  </div>
);

export default Layout;








