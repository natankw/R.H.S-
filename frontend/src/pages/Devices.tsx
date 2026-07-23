import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiCopy, FiPower, FiPowerOff } from 'react-icons/fi';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    model: '',
    manufacturer: '',
    android: '13',
    ram: 8,
    storage: 256,
    cpu: 'Snapdragon',
    resolution: '1080x2400',
    groupId: '',
    proxyId: '',
  });

  const fetchDevices = async () => {
    const res = await api.get('/devices');
    setDevices(res.data);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/devices/${editing.id}`, form);
    } else {
      await api.post('/devices', form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', model: '', manufacturer: '', android: '13', ram: 8, storage: 256, cpu: 'Snapdragon', resolution: '1080x2400', groupId: '', proxyId: '' });
    fetchDevices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await api.delete(`/devices/${id}`);
      fetchDevices();
    }
  };

  const handleClone = async (id: string) => {
    await api.post(`/devices/${id}/clone`);
    fetchDevices();
  };

  const handleStartStop = async (id: string, action: 'start' | 'stop') => {
    await api.post(`/devices/${id}/${action}`);
    fetchDevices();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dispositivos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-secondary transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Novo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device: any) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-4 rounded-xl neon-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                <p className="text-sm text-gray-400">{device.model} - {device.manufacturer}</p>
                <p className="text-xs text-gray-500">Status: <span className={device.status === 'ONLINE' ? 'text-green-400' : 'text-red-400'}>{device.status}</span></p>
                <p className="text-xs text-gray-500">Android: {device.android}</p>
                <p className="text-xs text-gray-500">RAM: {device.ram} GB | Storage: {device.storage} GB</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(device); setForm(device); setShowModal(true); }} className="text-blue-400 hover:text-blue-300"><FiEdit /></button>
                <button onClick={() => handleDelete(device.id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                <button onClick={() => handleClone(device.id)} className="text-yellow-400 hover:text-yellow-300"><FiCopy /></button>
                <button onClick={() => handleStartStop(device.id, device.status === 'ONLINE' ? 'stop' : 'start')} className={device.status === 'ONLINE' ? 'text-red-400' : 'text-green-400'}>
                  {device.status === 'ONLINE' ? <FiPowerOff /> : <FiPower />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="glass p-6 rounded-xl w-full max-w-md neon-border">
            <h2 className="text-xl font-bold text-white mb-4">{editing ? 'Editar' : 'Novo'} Dispositivo</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nome" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" required />
              <input value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} placeholder="Modelo" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" required />
              <input value={form.manufacturer} onChange={(e) => setForm({...form, manufacturer: e.target.value})} placeholder="Fabricante" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" required />
              <input value={form.android} onChange={(e) => setForm({...form, android: e.target.value})} placeholder="Android" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
              <input type="number" value={form.ram} onChange={(e) => setForm({...form, ram: Number(e.target.value)})} placeholder="RAM (GB)" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
              <input type="number" value={form.storage} onChange={(e) => setForm({...form, storage: Number(e.target.value)})} placeholder="Storage (GB)" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
              <input value={form.cpu} onChange={(e) => setForm({...form, cpu: e.target.value})} placeholder="CPU" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
              <input value={form.resolution} onChange={(e) => setForm({...form, resolution: e.target.value})} placeholder="Resolução" className="w-full px-3 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary hover:bg-secondary py-2 rounded-lg text-white font-semibold">Salvar</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-white">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
                                 }
