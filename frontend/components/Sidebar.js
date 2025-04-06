import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white rounded-2xl shadow p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Menú</h2>
      <ul className="space-y-3">
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
