import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const response = await fetch("http://192.168.101.7:8000/api/usuarios/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, []);

  

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 fixed top-0 w-full z-50 shadow-md">
      <Link href="/">
        <span className="text-white text-2xl font-semibold cursor-pointer">SociaLink</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/perfil" className="text-white">
          Mi Perfil
        </Link>
        {user && (
          <img
            src={user.foto_perfil_url}
            alt="Foto de perfil"
            className="rounded-full object-cover border-2 border-white shadow-sm"
            style={{ width: "36px", height: "36px" }}
          />
        )}
        <LogoutButton />
      </div>
    </nav>
  );

};

export default Navbar;

