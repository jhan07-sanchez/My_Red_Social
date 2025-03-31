const Post = ({ post }) => {
    return (
      <div className="border p-4 mb-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold">{post.autor}</h3>
        <p>{post.contenido}</p>
        <p className="text-sm text-gray-500">{post.fecha}</p>
      </div>
    );
  };
  
  export default Post;

  