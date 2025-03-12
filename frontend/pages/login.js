import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const res = await fetch("http://192.168.101.7:8000/api/usuario/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token); // Guardar token
        localStorage.setItem("usuario", JSON.stringify(data.user));
        router.push("/perfil"); // Redirigir al perfil
      } else {
        setError(data.detail || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="flex h-screen bg-blue-100 justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Iniciar sesión
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 mb-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 mb-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded font-bold"
          >
            Entrar
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-blue-600 text-sm">
            ¿Olvidaste tu contraseña?
          </a>
          <p className="mt-2">
            <a href="/registro" className="text-blue-600 text-sm font-bold">
              Crear nueva cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}