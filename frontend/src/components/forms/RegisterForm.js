import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";

const inputBase =
  "w-full px-4 py-3 mb-4 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 shadow-sm backdrop-blur";

const RegisterForm = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/registro/`, {
        nombre,
        email,
        password,
        password2: confirmPassword,
      });
      setStep(2);
    } catch (error) {
      const errores = error.response?.data;
      if (errores) {
        const mensajes = Object.entries(errores)
          .map(([campo, mensajes]) => {
            const texto = Array.isArray(mensajes) ? mensajes.join(", ") : mensajes;
            return `${campo}: ${texto}`;
          })
          .join("\n");
        setErrorMessage(mensajes);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/verificar-otp/`, {
        email,
        otp: verificationCode,
      });
      setStep(3);
    } catch (error) {
      setErrorMessage("Código incorrecto o expirado");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 shadow-2xl dark:shadow-black/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="register"
              onSubmit={handleRegister}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
              autoComplete="off"
            >
              <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                Registro
              </h2>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 mb-4 text-center text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`${inputBase} pl-10`}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} pl-10`}
                  required
                />
              </div>
              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pl-10 pr-10`}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputBase} pl-10 pr-10`}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Registrando...
                  </span>
                ) : (
                  "Registrarse"
                )}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="verify"
              onSubmit={handleVerify}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
              autoComplete="off"
            >
              <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                Verifica tu correo
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4 text-sm">
                Ingresa el código que enviamos a <span className="font-semibold">{email}</span>
              </p>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 mb-4 text-center text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Código de verificación"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`${inputBase} pl-10 tracking-widest text-lg text-center`}
                  required
                  maxLength={6}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
                disabled={otpLoading}
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Verificando...
                  </span>
                ) : (
                  "Verificar cuenta"
                )}
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2 text-green-600 dark:text-green-400">¡Cuenta verificada!</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.
              </p>
              {/* Aquí podrías poner un botón para ir al login */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
