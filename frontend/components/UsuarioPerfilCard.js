import { useState } from "react";
import axios from "axios";

export default function UsuarioPerfilCard({ user, onLogout }) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState(user.nombre);
  const [biografia, setBiografia] = useState(user.biografia || "");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleGuardar = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("biografia", biografia);
    if (fotoPerfil) {
      formData.append("foto_perfil", fotoPerfil);
    }

    try {
      const res = await axios.patch("http://192.168.101.7:8000/api/usuarios/editar/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      });

      if (res.status === 200) {
        setMensaje("Perfil actualizado correctamente");
        setModoEdicion(false);
        setUser(res.data); // O puedes actualizar el estado desde el padre
      }
    } catch (err) {
        console.error("Error al actualizar:", err.response?.data || err.message);
      setMensaje("Error al actualizar perfil");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Mi perfil</h1>

      {!modoEdicion ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">

          {user && (
            <img
            src={user.foto_perfil_url}
            alt="Foto de perfil"
            className="rounded-full object-cover border-2 border-white shadow-sm"
            style={{ width: "36px", height: "36px" }}
            />
          )}    

            <div>
              <p className="text-lg font-semibold">{user.nombre}</p>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-600 mt-2">{user.biografia || "Sin biografía"}</p>
            </div>
          </div>

          <button
            onClick={() => setModoEdicion(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition"
          >
            Editar perfil
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition mt-2"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nombre"
          />
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Biografía"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoPerfil(e.target.files[0])}
            className="w-full"
          />

          {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleGuardar}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
            >
              Guardar
            </button>
            <button
              onClick={() => setModoEdicion(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

  