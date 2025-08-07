import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tipoAReaccion = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
};

const Reacciones = ({ postId, reaccionesIniciales }) => {
  const [reacciones, setReacciones] = useState(reaccionesIniciales || []);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const token = localStorage.getItem("token");

  const handleReaccionar = async (tipo) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/publicaciones/publicaciones/${postId}/reaccionar/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tipo }),
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

  const reaccionesFiltradas = tipoSeleccionado
    ? reacciones.filter((r) => r.tipo === tipoSeleccionado)
    : reacciones;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        {Object.entries(tipoAReaccion).map(([tipo, emoji]) => (
          <button
            key={tipo}
            onClick={() => handleReaccionar(tipo)}
            className="hover:scale-110 transition-transform duration-150"
            title={tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          >
            {emoji}
          </button>
        ))}
        <button
          onClick={() => setMostrarModal(true)}
          className="text-sm text-gray-600 hover:underline ml-2"
        >
          Ver reacciones ({reacciones.length})
        </button>
      </div>

      <AnimatePresence>
        {mostrarModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setMostrarModal(false);
              setTipoSeleccionado(null);
            }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-lg max-w-sm w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-lg mb-4">Reacciones</h3>
              <div className="flex gap-2 mb-2">
                <button
                  className={`px-2 py-1 rounded ${
                    tipoSeleccionado === null
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setTipoSeleccionado(null)}
                >
                  Todas
                </button>
                {Object.entries(tipoAReaccion).map(([tipo, emoji]) => (
                  <button
                    key={tipo}
                    className={`px-2 py-1 rounded ${
                      tipoSeleccionado === tipo
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setTipoSeleccionado(tipo)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {reaccionesFiltradas.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-2 border-t py-2"
                  >
                    <img
                      src={
                        r.usuario?.foto_perfil_url ||
                        "/img/default-profile.png"
                      }
                      className="w-8 h-8 rounded-full"
                      alt="avatar"
                    />
                    <span className="text-sm font-medium">
                      {r.usuario?.nombre}
                    </span>
                    <span>{tipoAReaccion[r.tipo]}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reacciones;
