import { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Para el registro
  const [otpLoading, setOtpLoading] = useState(false); // Para la verificación OTP
  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar errores globales

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar errores previos

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true); // Iniciar carga
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/registro/`, {
        nombre,
        email,
        password,
        password2: confirmPassword,
      });
      alert("Se ha enviado un código de verificación a tu correo");
      setStep(2); // Cambiar a la verificación
    } catch (error) {
      console.error("Error de backend:", error.response?.data);
      const errores = error.response?.data;
      if (errores) {
        // Mostrar los errores de una forma más amigable
        const mensajes = Object.entries(errores)
          .map(([campo, mensajes]) => {
            const texto = Array.isArray(mensajes) ? mensajes.join(', ') : mensajes;
            return `${campo}: ${texto}`;
          })
          .join('\n');
        
        setErrorMessage(mensajes); // Establecer mensaje de error
      }
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpLoading(true); // Iniciar carga

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/verificar-otp/`, {
        email,
        otp: verificationCode,
      });
      console.log("Respuesta del backend:", response);
      alert("Cuenta verificada con éxito");
    } catch (error) {
      console.error("Error al verificar OTP:", error.response.data); // Ver los detalles del error
      alert("Error al verificar el código");
    } finally {
      setOtpLoading(false); // Finalizar carga
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-2xl shadow-md">
        {step === 1 && (
          <form onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

            {errorMessage && (
              <div className="text-red-600 mb-4">
                <p>{errorMessage}</p>
              </div>
            )}

            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
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
              disabled={loading} // Deshabilitar si está cargando
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <h2 className="text-2xl font-bold mb-6 text-center">Verificación</h2>
            
            {errorMessage && (
              <div className="text-red-600 mb-4">
                <p>{errorMessage}</p>
              </div>
            )}

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
              disabled={otpLoading} // Deshabilitar si está cargando
            >
              {otpLoading ? "Verificando..." : "Verificar cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
