import { useRouter } from "next/router";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token de la sesión
    router.push("/login");  // Redirigir al login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white py-2 px-4 rounded"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
