import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";

const Comentarios = ({ postId, comentariosIniciales }) => {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState(comentariosIniciales || []);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Traemos los datos del usuario desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("usuario");
      if (user) {
        setUsuarioActual(JSON.parse(user));
      }
    }
  }, []);

  const handleEnviarComentario = async () => {
    if (!comentario.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/publicaciones/comentarios/${postId}/comentar/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contenido: comentario }),
        }
      );

      if (response.ok) {
        const nuevoComentario = await response.json();
        setComentarios([...comentarios, nuevoComentario]);
        setComentario("");
      }
    } catch (error) {
      console.error("❌ Error comentando:", error);
    }
  };

  // Comentarios visibles (máx 3)
  const comentariosVisibles = mostrarTodos
    ? [...comentarios].reverse()
    : [...comentarios].slice(-3).reverse();

  return (
    <div className="mt-4">
      {/* Título */}
      <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Comentarios ({comentarios.length})
      </h4>

      {/* Lista de comentarios */}
      <div className="space-y-3">
        <AnimatePresence>
          {comentariosVisibles.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-start space-x-3"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={c.autor_foto || "/img/default-profile.png"}
                  alt={c.autor_nombre || "Usuario"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl max-w-sm">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {c.autor_nombre}
                </p>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                  <ReactMarkdown>{c.contenido}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Botón Ver más / Ver menos */}
      {comentarios.length > 3 && (
        <button
          onClick={() => setMostrarTodos(!mostrarTodos)}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {mostrarTodos ? "Ver menos comentarios" : "Ver más comentarios"}
        </button>
      )}

      {/* Caja para escribir un comentario tipo Facebook */}
      <div className="mt-4 flex items-center space-x-3">
        {/* Avatar del usuario actual */}
        <div className="flex-shrink-0">
          <img
            src={
              usuarioActual?.foto_perfil_url || "/img/default-profile.png"
            }
            alt={usuarioActual?.nombre || "Tú"}
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>

        {/* Input estilo burbuja */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
          />
          <button
            onClick={handleEnviarComentario}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comentarios;






