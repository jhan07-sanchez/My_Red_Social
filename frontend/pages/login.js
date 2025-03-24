import { useState } from "react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleRegister = () => {
    router.push("/registro");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/usuarios/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });


    console.log("Estado de la respuesta:", response.status); // Muestra el código de estado HTTP


    if (response.ok) {
      const data = await response.json();
      

    console.log("Respuesta completa del backend:", data); // Muestra toda la respuesta JSON

      console.log("Respuesta de la API:", data);

      alert("Inicio de sesión exitoso");
      // Corregido: Extraer correctamente el token del backend
    console.log("Token recibido del backend:", data.access_token);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    
    setUser(data.user); // Guardar solo los datos del usuario en el estado

      

      router.push("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full p-3 mb-4 border rounded-lg"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 mb-4 border rounded-lg"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg mb-4">
            Iniciar sesión
          </button>
        </form>
        <button onClick={handleRegister} className="w-full bg-gray-200 py-3 rounded-lg mb-4">
          Crear cuenta
        </button>
        <button onClick={handleForgotPassword} className="w-full text-blue-600">¿Olvidaste tu contraseña?</button>
      </div>
    </div>
  );
};

export default LoginPage;
