import { useState } from "react";
import { useRouter } from "next/router";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://192.168.101.7:8000/api/usuario/registro/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registro exitoso. Ahora inicia sesión.");
        router.push("/login");
      } else {
        setError(data.detail || "Error al registrarse");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="flex h-screen bg-blue-100 justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Crear Cuenta
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleRegistro}>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 mb-2 border rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
            Registrarse
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-600 font-bold">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}