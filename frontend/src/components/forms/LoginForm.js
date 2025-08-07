import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar cambios con validación
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (errors.email && value) {
      if (validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: null }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (errors.password && value.length >= 6) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validación del frontend
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "El correo es requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "Formato de correo inválido";
    }
    
    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Estado de la respuesta:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 401) {
          setErrors({ general: "Credenciales incorrectas. Verifica tu email y contraseña." });
        } else if (response.status === 400) {
          setErrors({ general: "Datos inválidos. Por favor verifica la información." });
        } else {
          setErrors({ general: "Error del servidor. Intenta nuevamente." });
        }
        return;
      }

      const data = await response.json();
      console.log("Respuesta completa del backend:", data);
      console.log("Objeto user:", data.user);

      const { user, access_token, refresh_token } = data;

      // Guardar preferencia de "recordarme"
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      }

      login(user, access_token, refresh_token);

      // Mostrar notificación de éxito
      const successNotification = document.createElement('div');
      successNotification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successNotification.textContent = `¡Bienvenido de vuelta, ${user.nombre}!`;
      document.body.appendChild(successNotification);
      
      setTimeout(() => {
        document.body.removeChild(successNotification);
      }, 3000);

      router.push("/");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setErrors({ general: "Error de conexión. Verifica tu internet e intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#0f172a] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative overflow-hidden"
      >
        {/* Efectos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-fuchsia-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <motion.img 
              src="/logo-socialink.png" 
              alt="Logo Socialink" 
              className="w-24 h-24 mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <h1 className="text-xl font-bold text-gray-300">Bienvenido a</h1>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
              SOCIALINK
            </h2>
            <p className="text-sm text-gray-400 mt-2">Conecta con tu red social</p>
          </motion.div>

          {/* Error general */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Correo electrónico
              </label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className={`flex items-center bg-gray-800/50 backdrop-blur-sm px-4 py-3 rounded-xl border transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500/50 bg-red-500/10' 
                    : 'border-gray-700 hover:border-cyan-500/50 focus-within:border-cyan-500'
                }`}
              >
                <FaEnvelope className="text-cyan-400 mr-3 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="tu@correo.com"
                  className="bg-transparent w-full outline-none text-white placeholder-gray-500"
                  autoComplete="email"
                />
              </motion.div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Contraseña
              </label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className={`flex items-center bg-gray-800/50 backdrop-blur-sm px-4 py-3 rounded-xl border transition-all duration-300 ${
                  errors.password 
                    ? 'border-red-500/50 bg-red-500/10' 
                    : 'border-gray-700 hover:border-cyan-500/50 focus-within:border-cyan-500'
                }`}
              >
                <FaLock className="text-cyan-400 mr-3 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="bg-transparent w-full outline-none text-white placeholder-gray-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-cyan-400 transition-colors ml-2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Opciones adicionales */}
            <div className="flex justify-between items-center text-sm">
              <motion.label 
                whileHover={{ scale: 1.05 }}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2 mr-2"
                />
                <span className="text-gray-300">Recordarme</span>
              </motion.label>
              
              <motion.button
                type="button"
                onClick={() => router.push("/forgot-password")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </motion.button>
            </div>

            {/* Botón de login */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 shadow-lg hover:shadow-cyan-500/25'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </motion.button>
          </form>

          {/* Link de registro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-gray-400 mt-8"
          >
            ¿No tienes una cuenta?{" "}
            <motion.button
              type="button"
              onClick={() => router.push("/registro")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Regístrate aquí
            </motion.button>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-xs text-gray-500">
              © 2024 SOCIALINK. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}