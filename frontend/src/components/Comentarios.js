import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const Comentarios = ({ postId, comentariosIniciales }) => {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState(comentariosIniciales || []);
  const token = localStorage.getItem("token");

  const handleEnviarComentario = async () => {
    if (!comentario.trim()) return;

    console.log("Comentario que se enviará:", comentario);

    try {
      const response = await fetch(
        `http://192.168.101.7:8000/api/publicaciones/comentarios/${postId}/comentar/`,
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
      console.error("Error comentando:", error);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">
        Comentarios ({comentarios.length})
      </h4>
      <AnimatePresence>
        {[...comentarios].reverse().map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t py-1 text-sm"
          >
            <strong>{c.autor_nombre}:</strong>{" "}
            <ReactMarkdown>{c.contenido}</ReactMarkdown>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-2 flex">
        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-1 border px-2 py-1 rounded-l"
        />
        <button
          onClick={handleEnviarComentario}
          className="bg-blue-600 text-white px-3 rounded-r hover:bg-blue-700"
        >
          Comentar
        </button>
      </div>
    </div>
  );
};

export default Comentarios;
