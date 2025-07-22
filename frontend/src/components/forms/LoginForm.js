import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Estado de la respuesta:", response.status);

      if (!response.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = await response.json();
      console.log("Respuesta completa del backend:", data);

      const { user, access_token, refresh_token } = data;

      login(user, access_token, refresh_token); // ✅ Guardamos ambos tokens

      alert("Inicio de sesión exitoso");
      router.push("/");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <div className="bg-[#0f172a] p-8 rounded-xl shadow-lg w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-socialink.png" alt="Logo Socialink" className="w-28 h-28 mb-4" />
          <h1 className="text-xl font-bold">Bienvenido a</h1>
          <h2 className="text-2xl font-extrabold">SOCIALINK</h2>
          <p className="text-sm text-gray-400 mt-1">Conecta con tu red social</p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="block text-sm mb-1">Correo electrónico</label>
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md mb-4 hover:scale-105 transition-transform">
            <FaEnvelope className="text-cyan-400 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="bg-transparent w-full outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <label className="block text-sm mb-1">Contraseña</label>
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md mb-2 hover:scale-105 transition-transform">
            <FaLock className="text-cyan-400 mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="bg-transparent w-full outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Recordarme
            </label>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-cyan-400 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:scale-105 transition-transform"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿No tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => router.push("/registro")}
            className="text-cyan-400 hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}