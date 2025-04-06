import { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/usuarios/registro/", {
        email,
        password,
      });
      alert("Se ha enviado un código de verificación a tu correo");
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Error en el registro");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/usuarios/verificar/", {
        email,
        code: verificationCode,
      });
      alert("Cuenta verificada con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al verificar el código");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-2xl shadow-md">
        {step === 1 && (
          <form onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Registrarse
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <h2 className="text-2xl font-bold mb-6 text-center">Verificación</h2>
            <input
              type="text"
              placeholder="Código de verificación"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Verificar cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
