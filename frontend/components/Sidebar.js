import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-1/5 p-4 bg-gray-200 min-h-screen fixed left-0 top-16">
      <ul>
        <li className="mb-4"><Link href="/">Inicio</Link></li>
        <li className="mb-4"><Link href="/perfil">Perfil</Link></li>
        <li className="mb-4"><Link href="/amigos">Amigos</Link></li>
        <li className="mb-4"><Link href="/mensajes">Mensajes</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
