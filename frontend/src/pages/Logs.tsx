import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiSearch, FiClock } from 'react-icons/fi';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    const res = await api.get('/logs');
    setLogs(res.data.logs);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs.filter((log: any) =>
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    (log.details || '').toLowerCase().includes(filter.toLowerCase())
  );

  const getColor = (action: string) => {
    if (action.includes('ERROR')) return 'text-red-400';
    if (action.includes('SUCCESS')) return 'text-green-400';
    if (action.includes('RUN')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Logs</h1>

      <div className="glass p-4 rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 bg-dark/50 border border-gray-700 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center text-gray-400">Carregando...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-400">Nenhum log encontrado</div>
        ) : (
          filteredLogs.map((log: any) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-3 rounded-xl flex items-start gap-3"
            >
              <FiClock className="text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className={`font-mono text-sm ${getColor(log.action)}`}>
                    {log.action}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                {log.details && (
                  <p className="text-sm text-gray-400 mt-1">{log.details}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
              }
