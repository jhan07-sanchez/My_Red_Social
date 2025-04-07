import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="bg-white p-4 mt-4 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4">Menú</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">Inicio</Link>
        </li>
        <li>
          <Link href="/perfil" className="text-blue-600 hover:underline">Perfil</Link>
        </li>
        <li>
          <Link href="/amigos" className="text-blue-600 hover:underline">Amigos</Link>
        </li>
        <li>
          <Link href="/mensajes" className="text-blue-600 hover:underline">Mensajes</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
