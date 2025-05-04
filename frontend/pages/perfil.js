// pages/perfil.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import UsuarioPerfilCard from "../components/UsuarioPerfilCard";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    axios.get("http://192.168.101.7:8000/api/usuarios/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setUser(res.data))
    .catch(() => router.push("/login"));
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {user ? (
        <UsuarioPerfilCard user={user} onLogout={cerrarSesion} />
      ) : (
        <p className="text-gray-500">Cargando...</p>
      )}
    </div>
  );
}
