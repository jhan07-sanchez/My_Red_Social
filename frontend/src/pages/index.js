import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import FriendsList from "../components/FriendsList";
import { AuthContext } from "../../context/AuthContext";

const IndexPage = () => {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, token, logout, updateUser, loadingAuth } = useContext(AuthContext);

  useEffect(() => {
    if (typeof window === "undefined") return; //  Esto es por SSR en Next.js
    
    if (loadingAuth) return; //  Espera a que AuthContext termine de cargar

    if (!token) {
      console.warn(" Token no encontrado, redirigiendo al login...");
      router.push("/login");
      return;
    }

    if (!localStorage.getItem("visto_bienvenida")) {
      setMostrarBienvenida(true);
      localStorage.setItem("visto_bienvenida", "true");
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Token inválido o expirado");

        const data = await response.json();
        console.log(" Datos completos del usuario:", data);

        updateUser(data);

      } catch (err) {
        console.error("❌ Error al obtener datos del usuario:", err);
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

  }, [loadingAuth, token]); //  Corrección: escuchamos los cambios de loadingAuth y token

  if (loading) return null; // Opcional: aquí puedes poner un spinner o mensaje de carga

  return (
    <div className="min-h-screen bg-gray-100">
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
