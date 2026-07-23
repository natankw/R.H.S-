import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiSmartphone, FiCpu, FiHardDrive, FiWifi } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    ram: 0,
    storage: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/devices');
        const devices = res.data;
        const total = devices.length;
        const online = devices.filter((d: any) => d.status === 'ONLINE').length;
        const offline = total - online;
        const ram = devices.reduce((acc: number, d: any) => acc + d.ram, 0);
        const storage = devices.reduce((acc: number, d: any) => acc + d.storage, 0);
        setStats({ total, online, offline, ram, storage });
      } catch (error) {
        console.error('Erro ao carregar estatísticas', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Dispositivos', value: stats.total, icon: FiSmartphone, color: 'text-blue-400' },
    { title: 'Online', value: stats.online, icon: FiWifi, color: 'text-green-400' },
    { title: 'Offline', value: stats.offline, icon: FiWifi, color: 'text-red-400' },
    { title: 'RAM Total', value: `${stats.ram} GB`, icon: FiCpu, color: 'text-yellow-400' },
    { title: 'Armazenamento', value: `${stats.storage} GB`, icon: FiHardDrive, color: 'text-purple-400' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-6 rounded-xl neon-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <card.icon className={`text-4xl ${card.color}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
                   }
