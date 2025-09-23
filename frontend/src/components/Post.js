"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  MessageCircle,
  Share,
  Bookmark,
  Flag,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Comentarios from "./Comentarios";
import Reacciones from "./Reacciones";

const Post = ({ post }) => {
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "ahora";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/40 dark:border-gray-700/40 rounded-3xl p-5 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={post.usuario?.foto_perfil_url || "/img/default-profile.png"}
              alt={post.usuario?.nombre || "Usuario"}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              {post.usuario?.nombre || "Usuario desconocido"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>@{post.usuario?.username || post.usuario?.email?.split("@")[0] || "usuario"}</span>
              <span>·</span>
              <span>{formatTimeAgo(post.fecha_creacion)}</span>
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowActions(!showActions)}
            aria-label="Opciones de publicación"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.button>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20"
              >
                <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <Bookmark className="w-4 h-4 mr-3" />
                  Guardar
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <Share className="w-4 h-4 mr-3" />
                  Compartir
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                  <Flag className="w-4 h-4 mr-3" />
                  Reportar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Contenido */}
      {post.contenido && (
        <div className="mb-4">
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-gray-800 dark:prose-p:text-gray-200">
            <ReactMarkdown>
              {expanded ? post.contenido : post.contenido.slice(0, 280)}
            </ReactMarkdown>
          </div>
          {post.contenido.length > 280 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-500 text-sm font-medium mt-2 hover:underline"
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}

      {/* Imagen */}
      {post.imagen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <img
            src={post.imagen}
            alt={`Imagen de ${post.usuario?.nombre || "usuario"}`}
            className="w-full h-auto max-h-[500px] object-cover sm:object-contain transition-transform duration-300 cursor-pointer hover:scale-[1.02]"
          />
        </motion.div>
      )}

      {/* Reacciones */}
      <Reacciones
        postId={post.id}
        reaccionesIniciales={Array.isArray(post.reacciones) ? post.reacciones : []}
      />

      {/* Acciones */}
      <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-gray-700/50 pt-4 mt-2">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Comentarios */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowComments(!showComments)}
            aria-label="Comentar"
            className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">
              Comentar {post.comentarios?.length || 0}
            </span>
          </motion.button>

          {/* Compartir */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            aria-label="Compartir"
            className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Share className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Compartir</span>
          </motion.button>
        </div>

        {/* Guardar */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          aria-label="Guardar"
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Bookmark className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Comentarios */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <Comentarios
              postId={post.id}
              comentariosIniciales={Array.isArray(post.comentarios) ? post.comentarios : []}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default Post;






