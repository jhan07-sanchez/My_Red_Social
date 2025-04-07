import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Componentes
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import FriendsList from "../components/FriendsList";

const IndexPage = () => {
  const [user, setUser] = useState(null);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Control del mensaje de bienvenida
    const yaVisto = localStorage.getItem("visto_bienvenida");
    if (!yaVisto) {
      setMostrarBienvenida(true);
      localStorage.setItem("visto_bienvenida", "true");
    }

    // Control de autenticación
    const token = localStorage.getItem("token");
    console.log("Token almacenado:", token);

    if (!token) {
      console.log("No hay token, redirigiendo a login...");
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/usuarios/me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Datos del usuario:", data);
          setUser(data);
        } else {
          console.error("Error al obtener usuario, sesión expirada");
          localStorage.removeItem("token");
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
      <Navbar />

      <div className="flex mt-20 px-4">
        <div className="w-1/5">
          <Sidebar />
        </div>

        <div className="w-3/5 px-4">
          {mostrarBienvenida && (
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h1 className="text-3xl font-bold mb-2">Bienvenido a tu página de inicio</h1>
              <p className="text-lg text-gray-600">
                Aquí puedes ver las publicaciones, interactuar con tus amigos y más.
              </p>
            </div>
          )}
          <Feed />
        </div>

        <div className="w-1/5">
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
