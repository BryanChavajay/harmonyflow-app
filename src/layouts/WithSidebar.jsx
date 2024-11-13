import { Link, useLocation, Outlet } from "react-router-dom";
import { useStoreAuth } from "../stores/GlobalAuth.jsx";

export function LayoutWithSidebar({ children }) {
  const location = useLocation();

  const user = useStoreAuth((state) => state.user);
  const permissions = useStoreAuth((state) => state.permissions);

  const modules = [
    { name: "MI-AGENDA", href: "/agenda" },
    { name: "MI-TABLERO", href: "/tablero" },
    { name: "BACKLOG", href: "/backlog" },
    { name: "PRUEBAS", href: "/pruebas" },
    { name: "PROYECTOS", href: "/proyectos" },
    { name: "LINEAS-DESARROLLO", href: "/lineas" },
    { name: "ESTADISTICAS", href: "/estadisticas" },
    { name: "USUARIOS", href: "/usuarios" },
    { name: "ROLES", href: "/roles" },
  ];

  const navigation = modules.filter((module) => {
    return permissions.some((permission) => {
      // const permissionName = permission.modulo.replace("-", " ");
      return permission.modulo === module.name;
    });
  });

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-200/95">
        {/* Header */}
        <header className="bg-cyan-700/95 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-white">HARMONY FLOW</h1>
            <div className="flex items-center gap-2">
              <span className="text-white">{user}</span>
              <button className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100">
                Flecha a bajo
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-cyan-700/95 shadow-sm overflow-y-auto">
            <nav className="flex flex-col gap-1 p-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-white hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-auto">
            <div className="rounded-lg bg-white p-6 shadow-sm min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Outlet />
    </>
  );
}