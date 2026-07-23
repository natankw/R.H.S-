import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function Proxies() {
  const [proxies, setProxies] = useState([]);
  const [form, setForm] = useState({ host: '', port: 8080, protocol: 'HTTP', username: '', password: '' });

  const fetchProxies = async () => {
    const res = await api.get('/proxies');
    setProxies(res.data);
  };

  useEffect(() => { fetchProxies(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/proxies', { ...form, port: Number(form.port) });
    setForm({ host: '', port: 8080, protocol: 'HTTP', username: '', password: '' });
    fetchProxies();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await api.delete(`/proxies/${id}`);
      fetchProxies();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Proxies</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input value={form.host} onChange={(e) => setForm({...form, host: e.target.value})} placeholder="Host" className="px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" required />
        <input type="number" value={form.port} onChange={(e) => setForm({...form, port: Number(e.target.value)})} placeholder="Porta" className="px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" required />
        <select value={form.protocol} onChange={(e) => setForm({...form, protocol: e.target.value})} className="px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white">
          <option>HTTP</option><option>HTTPS</option><option>SOCKS4</option><option>SOCKS5</option>
        </select>
        <input value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} placeholder="Usuário (opcional)" className="px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
        <input value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Senha (opcional)" className="px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
        <button type="submit" className="bg-primary hover:bg-secondary transition-colors px-4 py-2 rounded-lg flex items-center gap-2 justify-center"><FiPlus /> Adicionar</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proxies.map((proxy: any) => (
          <motion.div key={proxy.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-4 rounded-xl neon-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">{proxy.host}:{proxy.port}</h3>
              <p className="text-xs text-gray-400">{proxy.protocol} - {proxy.status}</p>
            </div>
            <button onClick={() => handleDelete(proxy.id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
