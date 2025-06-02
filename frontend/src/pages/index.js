import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import FriendsList from "../components/FriendsList";

const IndexPage = () => {
  const [user, setUser] = useState(null);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const yaVisto = localStorage.getItem("visto_bienvenida");
    if (!yaVisto) {
      setMostrarBienvenida(true);
      localStorage.setItem("visto_bienvenida", "true");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://192.168.101.7:8000/api/usuarios/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return null; // O un spinner simple mientras cargas el usuario

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
