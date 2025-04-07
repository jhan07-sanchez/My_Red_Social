import { useState } from "react";

const NuevoPost = ({ onPostCreado }) => {
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contenido.trim() && !imagen) {
      alert("Escribe algo o añade una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("contenido", contenido);
    if (imagen) {
      formData.append("imagen", imagen);
    }

    setCargando(true);
    try {
      const respuesta = await fetch("http://192.168.101.7:8000/api/publicaciones/publicaciones/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        console.error("Error al publicar:", errorText);
        throw new Error("Error al publicar");
      }
      if (!respuesta.ok) {
        throw new Error("Error al publicar");
      }

      const nuevoPost = await respuesta.json();
      console.log("Post creado:", nuevoPost);
      onPostCreado(nuevoPost);
      setContenido("");
      setImagen(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-3 resize-none"
        rows={3}
        placeholder="¿En qué estás pensando?"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="text-sm"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          {cargando ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
};

export default NuevoPost;

