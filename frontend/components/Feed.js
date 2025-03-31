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
    <div className="w-3/5 mx-auto mt-16">
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No hay publicaciones aún.</p>
      )}
    </div>
  );
};

export default Feed;
