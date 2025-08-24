import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, X, FileImage, Smile, Hash, AtSign } from "lucide-react";

const NuevoPost = ({ onPostCreado }) => {
  const { token } = useContext(AuthContext);
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(file.type)) {
      setError('Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setError(null);
    setImagen(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagen(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!contenido.trim() && !imagen) {
      setError("Escribe algo o añade una imagen.");
      return;
    }

    if (!token) {
      setError("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
      return;
    }

    const formData = new FormData();
    formData.append("contenido", contenido);
    
    if (imagen) {
      // Generar nombre único para la imagen
      const extension = imagen.name.split(".").pop().toLowerCase();
      const timestamp = Date.now();
      const nuevoNombre = `${timestamp}.${extension}`;
      
      const archivoRenombrado = new File([imagen], nuevoNombre, {
        type: imagen.type,
      });
      formData.append("imagen", archivoRenombrado);
    }

    setCargando(true);
    try {
      console.log('🚀 Enviando publicación...');
      
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/publicaciones/publicaciones/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        console.error("❌ Error al publicar:", respuesta.status, errorText);
        throw new Error(`Error ${respuesta.status}: ${errorText}`);
      }

      const nuevoPost = await respuesta.json();
      console.log("✅ Post creado:", nuevoPost);
      
      // Limpiar formulario
      setContenido("");
      setImagen(null);
      setPreviewUrl(null);
      setError(null);
      
      // Notificar al componente padre
      onPostCreado(nuevoPost);
      
    } catch (error) {
      console.error("❌ Error:", error);
      setError(error.message || "Error al crear la publicación");
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Campo de texto */}
      <div className="relative">
        <textarea
          className="w-full p-4 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all duration-200"
          rows={4}
          placeholder="¿Qué está pasando?"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          disabled={cargando}
          maxLength={500}
        />
        
        {/* Contador de caracteres */}
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
          {contenido.length}/500
        </div>
      </div>

      {/* Preview de imagen */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 relative"
          >
            <div className="relative w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-video">
                <Image
                  src={previewUrl}
                  alt="Vista previa"
                  fill
                  className="object-cover"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                
                {/* Botón eliminar imagen */}
                <motion.button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={cargando}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de herramientas */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {/* Input de imagen oculto */}
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
            disabled={cargando}
          />
          
          {/* Botón de imagen */}
          <motion.label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Camera className="w-4 h-4" />
            Imagen
          </motion.label>

          {/* Botones adicionales (opcional) */}
          <motion.button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={cargando}
          >
            <Smile className="w-4 h-4" />
            Emoji
          </motion.button>

          <motion.button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={cargando}
          >
            <Hash className="w-4 h-4" />
            Hashtag
          </motion.button>
        </div>

        {/* Botón publicar */}
        <motion.button
          type="submit"
          disabled={cargando || (!contenido.trim() && !imagen)}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: cargando ? 1 : 1.02, y: cargando ? 0 : -1 }}
          whileTap={{ scale: cargando ? 1 : 0.98 }}
        >
          {cargando ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Publicando...
            </span>
          ) : (
            "Publicar"
          )}
        </motion.button>
      </div>

      {/* Indicador de progreso (opcional) */}
      <AnimatePresence>
        {cargando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-3 border-blue-200 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Creando publicación...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default NuevoPost;
