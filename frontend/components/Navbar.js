import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 fixed top-0 w-full flex justify-between items-center shadow-md">
      <Link href="/">
        <span className="text-white text-2xl font-semibold cursor-pointer">Mi Red Social</span>
      </Link>
      <div className="flex items-center">
        <Link href="/perfil" className="text-white mr-4">Mi Perfil</Link>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
