import { useEffect, useState } from "react";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);  // Verifica si el token es correcto

    if (!token) {
      setError("No tienes sesión iniciada.");
      return;
    }

    fetch("http://192.168.101.7:8000/api/amistades/mis-amigos/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("No tienes permiso para ver la lista de amigos.");
          }
          throw new Error("Error en la solicitud.");
        }
        return response.json();
      })
      .then((data) => setFriends(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div className="w-1/5 p-4 bg-gray-200 min-h-screen fixed right-0 top-16">
      <h2 className="font-semibold mb-4">Amigos</h2>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>{friend.nombre}</li>
          ))}
        </ul>
      ) : (
        <p>No tienes amigos aún.</p>
      )}
    </div>
  );
};

export default FriendsList;
