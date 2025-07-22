import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      // Consultamos al backend quién es el usuario
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/me/`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token inválido o expirado");
          return res.json();
        })
        .then((userData) => {
          setUser(userData);
          setToken(savedToken);
          localStorage.setItem("user", JSON.stringify(userData)); // Refrescamos el user en localStorage por si lo necesitas después
          console.log("🔐 Sesión restaurada desde token:", userData);
        })
        .catch((e) => {
          console.error("⚠️ Error al cargar usuario desde /me/:", e);
          logout();
        })
        .finally(() => {
          setLoadingAuth(false);
        });
    } else {
      setLoadingAuth(false);
    }
  }, []);

  const login = (userData, tokenData) => {
    console.log("✅ Usuario logueado:", userData);
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    console.log("👋 Sesión cerrada");
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("visto_bienvenida");
    router.push("/login");
  };

  const updateUser = (newUserData) => {
    if (!user || user.id !== newUserData.id) {
      console.log("🔄 Actualizando usuario en contexto:", newUserData);
      setUser(newUserData);
      localStorage.setItem("user", JSON.stringify(newUserData));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
