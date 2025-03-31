import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
 // Componentes
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import FriendsList from "../components/FriendsList";

const IndexPage = () => {
  const [user, setUser] = useState(null); // Estado para manejar la información del usuario
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token almacenado:", token); // Verifica si el token está almacenado

    if (!token) {
      console.log("No hay token, redirigiendo a login...");
      router.push("/login"); // Redirigir al login si no hay token
      return;
    }

    // Función para obtener los datos del usuario
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/usuarios/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Datos del usuario:", data);
          setUser(data); // Guardar los datos del usuario en el estado
        } else {
          console.error("Error al obtener usuario, sesión expirada");
          localStorage.removeItem("token"); // Si la sesión expiró, eliminar token
          router.push("/login");
        }
      } catch (error) {
        console.error("Error en la solicitud de usuario:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar fijo arriba */}
      <Navbar />

      {/* Contenedor principal con Sidebar y Contenido */}
      <div className="flex">
        {/* Barra lateral */}
        <Sidebar />

        {/* Contenido + Feed en un layout flexible */}
        <div className="flex-1 flex p-8">
          {/* Contenido principal */}
          <div className="w-3/4 pr-4">
            <h1 className="text-3xl font-bold mb-4">Bienvenido a tu página de inicio</h1>
            <p className="text-lg mb-4">
              Aquí puedes ver las publicaciones, interactuar con tus amigos y más.
            </p>
          </div>

          {/* Feed (ocupa más espacio) */}
          <div className="w-1/4">
            <Feed />
          </div>
          {/* Lista de Amigos */}
        <div className="w-1/5">
          <FriendsList />
        </div>
           
        </div>
      </div>
    </div>
  );
};

export default IndexPage;