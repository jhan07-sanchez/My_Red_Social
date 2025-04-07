import { useState } from "react";

const Post = ({ post }) => {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState(post.comentarios || []);
  const [reacciones, setReacciones] = useState(post.reacciones || []);

  const token = localStorage.getItem("token");

  const handleEnviarComentario = async () => {
    if (!comentario.trim()) return;

    try {
      const response = await fetch(
        `http://192.168.101.7:8000/api/publicaciones/${post.id}/comentar/`,
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

  const handleReaccionar = async () => {
    try {
      const response = await fetch(
        `http://192.168.101.7:8000/api/publicaciones/${post.id}/reaccionar/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tipo: "like" }),
        }
      );

      if (response.ok) {
        const nuevaReaccion = await response.json();
        setReacciones([...reacciones, nuevaReaccion]);
      }
    } catch (error) {
      console.error("Error reaccionando:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-4">
      {/* Info del usuario */}
      <div className="flex items-center mb-3">
        <img
          src={post.usuario?.foto_perfil_url || "/img/default-profile.png"}
          alt="Perfil"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-semibold text-sm">
            {post.usuario?.nombre || "Usuario desconocido"}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(post.fecha_creacion).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contenido de la publicación */}
      <p className="mb-2">{post.contenido}</p>

      {/* Imagen de la publicación */}
      {post.imagen && (
        <img
          src={post.imagen}
          alt="Publicación"
          className="rounded mb-2 max-h-80 object-cover w-full"
        />
      )}

      {/* Botón de reacción */}
      <button
        onClick={handleReaccionar}
        className="text-blue-600 hover:underline text-sm mr-4"
      >
        👍 Me gusta ({reacciones.length})
      </button>

      {/* Comentarios */}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">
          Comentarios ({comentarios.length})
        </h4>

        {/* Lista de comentarios en orden inverso */}
        {[...comentarios].reverse().map((c) => (
          <div key={c.id} className="border-t py-1 text-sm">
            <strong>{c.autor_nombre}:</strong> {c.contenido}
          </div>
        ))}

        {/* Formulario para comentar */}
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
    </div>
  );
};

export default Post;
