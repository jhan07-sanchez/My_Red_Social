import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Comentarios from "./Comentarios";
import Reacciones from "./Reacciones";

const Post = ({ post }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-4">
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

      <div className="mb-2">
        <ReactMarkdown>{post.contenido}</ReactMarkdown>
      </div>

      {post.imagen && (
        <img
          src={post.imagen}
          alt="Publicación"
          className="rounded mb-2 max-h-80 object-cover w-full"
        />
      )}

      {/* Reacciones */}
      <Reacciones postId={post.id} reaccionesIniciales={Array.isArray(post.reacciones) ? post.reacciones : []} />

      {/* Comentarios */}
      <Comentarios postId={post.id} comentariosIniciales={Array.isArray(post.comentarios) ? post.comentarios : []} />
      
     


      {/* Botón para ver más comentarios */}
      {post.comentarios && post.comentarios.length > 3 && (
        <button className="text-blue-500 mt-2">
          Ver más comentarios ({post.comentarios.length - 3})
        </button>
      )}
    </div>
  );
};

export default Post;

