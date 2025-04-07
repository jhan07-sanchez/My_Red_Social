import { useEffect, useState } from "react";
import Post from "./Post";
import NuevoPost from "./NuevoPost"; // Solo este

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const cargarPosts = () => {
    fetch("http://192.168.101.7:8000/api/publicaciones/publicaciones/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Respuesta inesperada del backend:", data);
          setPosts([]);
        }
        
      })
      .catch((error) => console.error("Error cargando publicaciones:", error));
  };

  useEffect(() => {
    cargarPosts();
  }, []);

  const agregarNuevoPost = (nuevoPost) => {
    setPosts([nuevoPost, ...posts]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Crear una nueva publicación</h2>

      {/* Formulario único de publicación */}
      <div className="mb-6">
        <NuevoPost onPostCreado={agregarNuevoPost} />
      </div>

      {/* Publicaciones existentes */}
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No hay publicaciones aún.</p>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Feed;

