"use client";
import React, { useState, useContext, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  MessageCircle,
  Share,
  Bookmark,
  Flag,
  Heart,
  Copy,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Download,
  Maximize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Comentarios from "./Comentarios";
import Reacciones from "./Reacciones";
import { AuthContext } from "../../context/AuthContext";

// Componente para modal de imagen
const ImageModal = ({ isOpen, onClose, imageSrc, alt }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-7xl max-h-full"
        >
          <img
            src={imageSrc}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente de confirmación para acciones críticas
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
  if (!isOpen) return null;

  const colors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-white transition-colors ${colors[type]}`}
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Toast notification
const Toast = ({ message, type = "success", isVisible, onClose }) => {
  if (!isVisible) return null;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={`fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2`}
      >
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

const Post = ({ post, onDelete, onUpdate }) => {
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.contenido || "");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viewCount, setViewCount] = useState(post.vistas || 0);
  const [hasViewed, setHasViewed] = useState(false);

  const { user } = useContext(AuthContext);
  const postRef = useRef(null);
  const speechSynth = useRef(null);

  // Marcar como visto cuando el post aparece en viewport
  const handleViewPost = useCallback(() => {
    if (!hasViewed) {
      setHasViewed(true);
      setViewCount(prev => prev + 1);
    }
  }, [hasViewed]);

  // Observer para detectar cuando el post está visible
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleViewPost();
        }
      },
      { threshold: 0.5 }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => observer.disconnect();
  }, [handleViewPost]);

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

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      showToast("Enlace copiado al portapapeles");
    } catch (error) {
      showToast("Error al copiar enlace", "error");
    }
  };

  const handleSharePost = async () => {
    const shareData = {
      title: `Post de ${post.usuario?.nombre}`,
      text: post.contenido?.slice(0, 100) + "...",
      url: `${window.location.origin}/post/${post.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Post compartido exitosamente");
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(isBookmarked ? "Removido de guardados" : "Guardado exitosamente");
  };

  const handleReport = () => {
    showToast("Reporte enviado. Gracias por tu colaboración", "info");
    setShowActions(false);
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(post.id);
        showToast("Post eliminado exitosamente");
      }
    } catch (error) {
      showToast("Error al eliminar el post", "error");
    }
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedPost = { ...post, contenido: editedContent };
      if (onUpdate) {
        await onUpdate(updatedPost);
        showToast("Post actualizado exitosamente");
      }
      setIsEditing(false);
    } catch (error) {
      showToast("Error al actualizar el post", "error");
    }
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(post.contenido);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
          setIsSpeaking(false);
          showToast("Error en síntesis de voz", "error");
        };
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      showToast("Síntesis de voz no disponible", "warning");
    }
  };

  const downloadImage = async () => {
    if (post.imagen) {
      try {
        const response = await fetch(post.imagen);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `post-${post.id}-image.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast("Imagen descargada exitosamente");
      } catch (error) {
        showToast("Error al descargar imagen", "error");
      }
    }
  };

  const isOwnPost = user && post.usuario && user.id === post.usuario.id;

  return (
    <motion.article
      ref={postRef}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/40 dark:border-gray-700/40 rounded-3xl p-5 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* Indicador de post visto */}
      {hasViewed && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Avatar con estado online */}
          <div className="relative">
            <img
              src={post.usuario?.foto_perfil_url || "/img/default-profile.png"}
              alt={post.usuario?.nombre || "Usuario"}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-md hover:scale-105 transition-transform cursor-pointer"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
          </div>

          {/* Info del usuario */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {post.usuario?.nombre || "Usuario desconocido"}
              </h3>
              {post.usuario?.verificado && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="hover:text-blue-500 cursor-pointer transition-colors">
                @{post.usuario?.username || post.usuario?.email?.split("@")[0] || "usuario"}
              </span>
              <span>·</span>
              <span>{formatTimeAgo(post.fecha_creacion)}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{viewCount}</span>
              </div>
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
              <>
                {/* Overlay para cerrar */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20 backdrop-blur-lg"
                >
                  {/* Acciones para el propio post */}
                  {isOwnPost && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowActions(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-3" />
                        Editar post
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowActions(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Eliminar post
                      </button>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>
                    </>
                  )}

                  {/* Acciones generales */}
                  <button
                    onClick={() => {
                      handleBookmark();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 mr-3 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    {isBookmarked ? 'Quitar de guardados' : 'Guardar post'}
                  </button>
                  
                  <button
                    onClick={() => {
                      handleCopyLink();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-3" />
                    Copiar enlace
                  </button>

                  <button
                    onClick={() => {
                      handleSharePost();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Share className="w-4 h-4 mr-3" />
                    Compartir
                  </button>

                  {post.contenido && (
                    <button
                      onClick={() => {
                        handleTextToSpeech();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4 mr-3" /> : <Volume2 className="w-4 h-4 mr-3" />}
                      {isSpeaking ? 'Detener lectura' : 'Leer en voz alta'}
                    </button>
                  )}

                  {post.imagen && (
                    <button
                      onClick={() => {
                        downloadImage();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-3" />
                      Descargar imagen
                    </button>
                  )}

                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>

                  {!isOwnPost && (
                    <button
                      onClick={() => {
                        handleReport();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Flag className="w-4 h-4 mr-3" />
                      Reportar post
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Contenido editable */}
      {isEditing ? (
        <div className="mb-4 space-y-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows="4"
            placeholder="Edita tu post..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(post.contenido || "");
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      ) : (
        /* Contenido normal */
        post.contenido && (
          <div className="mb-4">
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-gray-800 dark:prose-p:text-gray-200">
              <ReactMarkdown>
                {expanded ? post.contenido : post.contenido.slice(0, 280)}
              </ReactMarkdown>
            </div>
            {post.contenido.length > 280 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 text-sm font-medium mt-2 hover:underline transition-all"
              >
                {expanded ? "Ver menos" : "Ver más"}
              </motion.button>
            )}
          </div>
        )
      )}

      {/* Imagen con funcionalidades mejoradas */}
      {post.imagen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative group"
        >
          <img
            src={post.imagen}
            alt={`Imagen de ${post.usuario?.nombre || "usuario"}`}
            className="w-full h-auto max-h-[500px] object-cover sm:object-contain transition-transform duration-300 cursor-pointer hover:scale-[1.02]"
            onClick={() => setShowImageModal(true)}
          />
          
          {/* Overlay con controles */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <motion.button
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowImageModal(true)}
              className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg backdrop-blur-sm"
            >
              <Maximize2 className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Reacciones mejoradas */}
      <div className="mb-4">
        <Reacciones
          postId={post.id}
          reaccionesIniciales={Array.isArray(post.reacciones) ? post.reacciones : []}
        />
      </div>

      {/* Acciones principales */}
      <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-gray-700/50 pt-4 mt-2">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Comentarios */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowComments(!showComments)}
            aria-label="Comentar"
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
              showComments 
                ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">
              {post.comentarios?.length || 0}
            </span>
          </motion.button>

          {/* Like rápido */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Me gusta"
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
              isLiked 
                ? 'text-red-500 bg-red-100 dark:bg-red-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline text-sm font-medium">
              {(post.likes_count || 0) + (isLiked ? 1 : 0)}
            </span>
          </motion.button>

          {/* Compartir */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSharePost}
            aria-label="Compartir"
            className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <Share className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Compartir</span>
          </motion.button>
        </div>

        {/* Guardar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleBookmark}
          aria-label="Guardar"
          className={`p-2 rounded-full transition-all duration-200 ${
            isBookmarked 
              ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20' 
              : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Comentarios mejorados */}
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

      {/* Modal de imagen */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={post.imagen}
        alt={`Imagen de ${post.usuario?.nombre || "usuario"}`}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="¿Eliminar publicación?"
        message="Esta acción no se puede deshacer. El post y todos sus comentarios serán eliminados permanentemente."
        type="danger"
      />

      {/* Toast de notificaciones */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />
    </motion.article>
  );
};

export default Post;





