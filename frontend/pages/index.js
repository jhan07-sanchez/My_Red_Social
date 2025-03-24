import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton"; // Si tienes el componente de logout

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
      {/* Barra de navegación */}
      <nav className="bg-blue-600 p-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-white text-2xl font-semibold">Mi Red Social</span>
          </Link>
          <div className="flex items-center">
          {user && user.nombre ? (
  <span className="text-white mr-4">{`Hola, ${user.nombre}`}</span>
) : (
  <span className="text-white mr-4">Cargando...</span>
)}
            <LogoutButton /> {/* Botón de logout */}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a tu página de inicio</h1>
        <p className="text-lg mb-4">Aquí puedes ver las publicaciones, interactuar con tus amigos y más.</p>
        
        {/* Aquí podrías incluir un feed de publicaciones, tus amigos, etc. */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Últimas publicaciones</h2>
          {/* Aquí puedes mapear las publicaciones si tienes un feed implementado */}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
