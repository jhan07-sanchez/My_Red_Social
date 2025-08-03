import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

const NuevoPost = ({ onPostCreado }) => {
  const { token } = useContext(AuthContext);
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagen(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contenido.trim() && !imagen) {
      alert("Escribe algo o añade una imagen.");
      return;
    }

    if (!token) {
      alert("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
      return;
    }

    const formData = new FormData();
    formData.append("contenido", contenido);
    if (imagen) {
      const extension = imagen.name.split(".").pop();
      const nuevoNombre = `${Date.now()}.${extension}`;
      const archivoRenombrado = new File([imagen], nuevoNombre, {
        type: imagen.type,
      });
      formData.append("imagen", archivoRenombrado);
    }

    setCargando(true);
    try {
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
        console.error("Error al publicar:", errorText);
        throw new Error("Error al publicar");
      }

      const nuevoPost = await respuesta.json();
      console.log("Post creado:", nuevoPost);
      onPostCreado(nuevoPost);
      setContenido("");
      setImagen(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-3 resize-none"
        rows={3}
        placeholder="¿En qué estás pensando?"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm"
        />

        <motion.button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          {cargando ? "Publicando..." : "Publicar"}
        </motion.button>
      </div>

      {previewUrl && (
        <motion.div
          className="mt-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-40 h-auto rounded-md border"
          />
        </motion.div>
      )}
    </motion.form>
  );
};

export default NuevoPost;
