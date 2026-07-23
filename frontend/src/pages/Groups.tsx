import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');

  const fetchGroups = async () => {
    const res = await api.get('/groups');
    setGroups(res.data);
  };

  useEffect(() => { fetchGroups(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/groups', { name });
    setName('');
    fetchGroups();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await api.delete(`/groups/${id}`);
      fetchGroups();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Grupos</h1>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do grupo" className="flex-1 px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" required />
        <button type="submit" className="bg-primary hover:bg-secondary transition-colors px-4 py-2 rounded-lg flex items-center gap-2"><FiPlus /> Criar</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group: any) => (
          <motion.div key={group.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-4 rounded-xl neon-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">{group.name}</h3>
              <p className="text-xs text-gray-400">{group.devices?.length || 0} dispositivos</p>
            </div>
            <button onClick={() => handleDelete(group.id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
