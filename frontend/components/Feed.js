import { useEffect, useState } from "react";
import Post from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://192.168.101.7:8000/api/publicaciones/")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error cargando publicaciones:", error));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Publicaciones</h2>
      <p className="text-gray-500">No hay publicaciones aún.</p>
    </div>
  );
};

export default Feed;
