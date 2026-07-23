import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlus, FiPlay, FiTrash2, FiEdit2, FiClock } from 'react-icons/fi';

export default function Automation() {
  const [automations, setAutomations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    schedule: '',
    flow: '[]'
  });

  const fetchAutomations = async () => {
    const res = await api.get('/automation');
    setAutomations(res.data);
  };

  useEffect(() => { fetchAutomations(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/automation/${editing.id}`, {
        ...form,
        flow: JSON.parse(form.flow)
      });
    } else {
      await api.post('/automation', {
        ...form,
        flow: JSON.parse(form.flow)
      });
    }
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', schedule: '', flow: '[]' });
    fetchAutomations();
  };

  const handleRun = async (id: string) => {
    await api.post(`/automation/${id}/run`);
    fetchAutomations();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await api.delete(`/automation/${id}`);
      fetchAutomations();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Automações</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-secondary transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Nova Automação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.map((auto: any) => (
          <motion.div
            key={auto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-4 rounded-xl neon-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{auto.name}</h3>
                <p className="text-xs text-gray-400">
                  Status: <span className={auto.status === 'ACTIVE' ? 'text-green-400' : 'text-yellow-400'}>
                    {auto.status}
                  </span>
                </p>
                {auto.schedule && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <FiClock /> {auto.schedule}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Execuções: {auto.logs?.length || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRun(auto.id)} className="text-green-400 hover:text-green-300">
                  <FiPlay />
                </button>
                <button onClick={() => { setEditing(auto); setForm({ name: auto.name, schedule: auto.schedule || '', flow: JSON.stringify(auto.flow) }); setShowModal(true); }} className="text-blue-400 hover:text-blue-300">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(auto.id)} className="text-red-400 hover:text-red-300">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="glass p-6 rounded-xl w-full max-w-lg neon-border">
            <h2 className="text-xl font-bold text-white mb-4">
              {editing ? 'Editar' : 'Nova'} Automação
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Nome da automação"
                className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white"
                required
              />
              <input
                value={form.schedule}
                onChange={(e) => setForm({...form, schedule: e.target.value})}
                placeholder="Agendamento (ex: */5 * * * *)"
                className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white"
              />
              <textarea
                value={form.flow}
                onChange={(e) => setForm({...form, flow: e.target.value})}
                placeholder='[{"action": "start", "params": {"deviceId": "id"}}]'
                className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white h-32"
                required
              />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary hover:bg-secondary py-2 rounded-lg text-white font-semibold">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditing(null); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
        }
