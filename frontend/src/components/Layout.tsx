import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { FiHome, FiSmartphone, FiUsers, FiLink, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/devices', label: 'Dispositivos', icon: FiSmartphone },
  { path: '/groups', label: 'Grupos', icon: FiUsers },
  { path: '/proxies', label: 'Proxies', icon: FiLink },
];

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        className="w-20 lg:w-64 glass border-r border-gray-800 p-4 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-bold text-primary">RHS</span>
          <span className="hidden lg:inline text-sm text-gray-400">PREMIUM</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-primary/20 text-primary neon-border'
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-auto"
        >
          <FiLogOut size={20} />
          <span className="hidden lg:inline">Sair</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
        }
