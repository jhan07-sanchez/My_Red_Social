"use client";
import { useState } from "react";
import {
  Home,
  User,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", icon: <Home className="w-5 h-5" /> },
    { name: "Perfil", icon: <User className="w-5 h-5" /> },
    { name: "Amigos", icon: <Users className="w-5 h-5" /> },
    { name: "Mensajes", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Notificaciones", icon: <Bell className="w-5 h-5" /> },
    { name: "Configuración", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border hover:bg-gray-100 transition"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
           fixed top-20 left-4 h-[calc(100%-8.9rem)] w-72 bg-white/80 dark:bg-gray-900/80
           border-r border-gray-200 dark:border-gray-700 shadow-2xl z-50
           mt-4 ml-4 rounded-2xl backdrop-blur-xl overflow-hidden
           transition-transform duration-300 ease-in-out
           ${open ? "block translate-x-0" : "hidden"} md:block md:translate-x-0
         `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Mi Red
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Menú */}
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {item.icon}
              <span className="text-base font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition w-full">
            <LogOut className="w-5 h-5" />
            <span className="text-base font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


