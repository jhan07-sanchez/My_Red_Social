"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import FriendsList from "../components/FriendsList";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const IndexPage = () => {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, logout, updateUser, loadingAuth } = useContext(AuthContext);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (loadingAuth) return;

    if (!token) {
      console.warn("❌ Token no encontrado, redirigiendo al login...");
      router.push("/login");
      return;
    }

    if (!localStorage.getItem("visto_bienvenida")) {
      setMostrarBienvenida(true);
      localStorage.setItem("visto_bienvenida", "true");
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Token inválido o expirado");

        const data = await response.json();
        console.log("✅ Datos completos del usuario:", data);

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
  }, [loadingAuth, token]);

  // 🔄 Loading Spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-light dark:bg-neutral-dark">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark text-gray-900 dark:text-white">
      {/* GRID principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-20 px-4 w-full lg:max-w-7xl lg:mx-auto">
               
        {/* Sidebar izquierdo */}
        <aside className="hidden md:block md:col-span-1">
          <Sidebar />
        </aside>

        {/* Feed central */}
        <main className="col-span-1 md:col-span-3 lg:col-span-4 max-w-2xl mx-auto w-full">
          {mostrarBienvenida && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6"
            >
              <h1 className="text-2xl font-bold mb-2">
                🎉 Bienvenido a tu página de inicio
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300">
                Aquí puedes ver las publicaciones, interactuar con tus amigos y mucho más.
              </p>
            </motion.div>
          )}

          {/* Feed */}
          <Feed />
        </main>

        {/* Sidebar derecho */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <FriendsList />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default IndexPage;


