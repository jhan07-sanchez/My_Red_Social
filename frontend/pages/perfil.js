import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      router.push("/login");
    } else {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      {user ? (
        <div>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => {
            localStorage.removeItem("usuario");
            router.push("/login");
          }}>Cerrar Sesión</button>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}