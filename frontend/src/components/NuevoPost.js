"use client";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Camera, X, Smile, Hash, AtSign } from "lucide-react";

const NuevoPost = ({ onPostCreado }) => {
  const { token } = useContext(AuthContext);
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // 📸 Manejar imagen seleccionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!tiposPermitidos.includes(file.type)) {
      setError("Solo se permiten imágenes (JPEG, PNG, WebP, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB");
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
  };

  // 🚀 Enviar nuevo post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim() && !imagen) {
      setError("Escribe algo o añade una imagen.");
      return;
    }
    if (!token) {
      setError("Tu sesión ha expirado, inicia sesión.");
      return;
    }

    const formData = new FormData();
    formData.append("contenido", contenido);

    if (imagen) {
      const extension = imagen.name.split(".").pop().toLowerCase();
      const nuevoNombre = `${Date.now()}.${extension}`;
      const archivoRenombrado = new File([imagen], nuevoNombre, { type: imagen.type });
      formData.append("imagen", archivoRenombrado);
    }

    setCargando(true);
    try {
      const respuesta = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/publicaciones/publicaciones/`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );

      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

      const nuevoPost = await respuesta.json();
      setContenido("");
      removeImage();
      onPostCreado(nuevoPost);
    } catch (error) {
      setError(error.message || "Error al publicar");
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
      transition={{ duration: 0.4 }}
    >
      {/* ✍️ Campo de texto */}
      <textarea
        className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-2xl 
                   bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   placeholder-gray-400 dark:placeholder-gray-500 resize-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        rows={3}
        placeholder="¿Qué estás pensando?"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        disabled={cargando}
        maxLength={500}
      />

      {/* 📷 Preview de imagen */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 relative"
          >
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image src={previewUrl} alt="Vista previa" fill className="object-cover" />
              <motion.button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full 
                           flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ Error */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* 🛠️ Barra de herramientas */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Fila de botones */}
          <div className="flex flex-wrap gap-2">
            <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
            <motion.label htmlFor="image-upload" className="btn-tool">
              <Camera className="w-4 h-4" /> Imagen
            </motion.label>
            <button type="button" className="btn-tool">
              <Smile className="w-4 h-4" /> Emoji
            </button>
            <button type="button" className="btn-tool">
              <Hash className="w-4 h-4" /> Hashtag
            </button>
            <button type="button" className="btn-tool">
              <AtSign className="w-4 h-4" /> Mención
            </button>
          </div>

          {/* Botón Publicar */}
          <motion.button
            type="submit"
            disabled={cargando || (!contenido.trim() && !imagen)}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                       rounded-xl font-semibold shadow hover:shadow-lg 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: cargando ? 1 : 1.02 }}
            whileTap={{ scale: cargando ? 1 : 0.98 }}
          >
            {cargando ? "Publicando..." : "Publicar"}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default NuevoPost;

