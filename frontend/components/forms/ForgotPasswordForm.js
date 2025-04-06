import { useState } from "react";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/usuarios/solicitar-recuperacion/", {
        email,
      });
      alert("Se ha enviado un código a tu correo electrónico");
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Error al solicitar recuperación");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/usuarios/restablecer-contrasena/", {
        email,
        code,
        new_password: newPassword,
      });
      alert("Contraseña restablecida con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al restablecer la contraseña");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-2xl shadow-md">
        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <h2 className="text-2xl font-bold mb-6 text-center">Recuperar contraseña</h2>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Enviar código
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-bold mb-6 text-center">Nueva contraseña</h2>
            <input
              type="text"
              placeholder="Código de verificación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Restablecer contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
