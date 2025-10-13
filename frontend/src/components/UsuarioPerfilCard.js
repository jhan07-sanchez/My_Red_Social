import { useState, useRef, useEffect } from "react";
import axios from "axios";


export default function UsuarioPerfilCard({ user, setUser, onLogout }) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState(user.nombre);
  const [biografia, setBiografia] = useState(user.biografia || "");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (fotoPerfil) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(fotoPerfil);
    } else {
      setPreview(null);
    }
  }, [fotoPerfil]);

  const handleGuardar = async () => {
    setMensaje("");
    setError("");
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("biografia", biografia);
    if (fotoPerfil) {
      formData.append("foto_perfil", fotoPerfil);
    }
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/editar/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (isMounted.current) {
        if (res.status === 200) {
          setMensaje("Perfil actualizado correctamente");
          setModoEdicion(false);
          setUser(res.data);
        }
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.response?.data?.nombre) {
          setError("Nombre inválido: " + err.response.data.nombre.join(", "));
        } else if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Error al actualizar perfil");
        }
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-neutral-900 shadow rounded-xl overflow-hidden" aria-label="Perfil de usuario">
      {/* Portada tipo Facebook */}
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-900 dark:to-blue-700">
        {/* Foto de perfil grande superpuesta */}
        <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
          <img
            src={user.foto_perfil_url}
            alt={user.nombre ? `Foto de perfil de ${user.nombre}` : "Foto de perfil"}
            className="rounded-full border-4 border-white shadow-lg object-cover"
            style={{ width: "120px", height: "120px" }}
            aria-label="Foto de perfil"
          />
        </div>
      </div>
      <div className="pt-16 pb-8 px-6 flex flex-col items-center">
        {!modoEdicion ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1" aria-label="Nombre de usuario">{user.nombre}</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-1" aria-label="Correo electrónico">{user.email}</p>
            <p className="text-gray-700 dark:text-gray-200 text-center mb-4" aria-label="Biografía">{user.biografia || "Sin biografía"}</p>
            <div className="flex gap-3 w-full max-w-xs mt-2">
              <button
                onClick={() => setModoEdicion(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                aria-label="Editar perfil"
              >
                Editar perfil
              </button>
              <button
                onClick={onLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition"
                aria-label="Cerrar sesión"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <form className="space-y-4 w-full max-w-xs mt-2" onSubmit={e => { e.preventDefault(); handleGuardar(); }} aria-label="Formulario de edición de perfil">
            <label className="block">
              <span className="sr-only">Nombre</span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded dark:bg-neutral-800 dark:text-gray-100"
                placeholder="Nombre"
                aria-required="true"
                aria-label="Nombre"
              />
            </label>
            <label className="block">
              <span className="sr-only">Biografía</span>
              <textarea
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                className="w-full p-2 border rounded dark:bg-neutral-800 dark:text-gray-100"
                placeholder="Biografía"
                aria-label="Biografía"
              />
            </label>
            <label className="block">
              <span className="sr-only">Foto de perfil</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFotoPerfil(e.target.files[0])}
                className="w-full dark:bg-neutral-800 dark:text-gray-100"
                aria-label="Foto de perfil"
              />
            </label>
            {preview && (
              <div className="flex justify-center">
                <img src={preview} alt="Previsualización de la nueva foto de perfil" className="rounded-full object-cover border-2 border-blue-200 shadow" style={{ width: "80px", height: "80px" }} />
              </div>
            )}
            {loading && <p className="text-blue-500 text-sm">Actualizando perfil...</p>}
            {mensaje && <p className="text-green-600 text-sm" role="status">{mensaje}</p>}
            {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl disabled:opacity-60"
                aria-label="Guardar cambios"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => { setModoEdicion(false); setError(""); setMensaje(""); setFotoPerfil(null); setPreview(null); }}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl"
                aria-label="Cancelar edición"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

  