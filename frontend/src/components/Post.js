import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Comentarios from "./Comentarios";
import Reacciones from "./Reacciones";

const Post = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-card rounded-2xl p-5 mb-6 animate-fadeIn">
      {/* Header usuario */}
      <div className="flex items-center mb-4">
        <img
          src={post.usuario?.foto_perfil_url || "/img/default-profile.png"}
          alt="Perfil"
          className="w-11 h-11 rounded-full object-cover mr-3 shadow-soft"
        />
        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {post.usuario?.nombre || "Usuario desconocido"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.fecha_creacion).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contenido */}
      {post.contenido && (
        <div className="mb-3 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{post.contenido}</ReactMarkdown>
        </div>
      )}

      {/* Imagen */}
      {post.imagen && (
        <img
          src={post.imagen}
          alt="Publicación"
          className="rounded-xl mb-3 max-h-96 object-cover w-full shadow-soft"
        />
      )}

      {/* Reacciones */}
      <Reacciones
        postId={post.id}
        reaccionesIniciales={
          Array.isArray(post.reacciones) ? post.reacciones : []
        }
      />

      {/* Comentarios */}
      <Comentarios
        postId={post.id}
        comentariosIniciales={
          Array.isArray(post.comentarios) ? post.comentarios : []
        }
      />

      
    </div>
  );
};

export default Post;





