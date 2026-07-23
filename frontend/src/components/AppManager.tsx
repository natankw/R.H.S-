import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPackage, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

export default function AppManager() {
  const [apps, setApps] = useState([]);

  const fetchApps = async () => {
    const res = await api.get('/apps');
    setApps(res.data);
  };

  useEffect(() => { fetchApps(); }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/vnd.android.package-archive': ['.apk'] },
    onDrop: async (files) => {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('name', files[0].name.replace('.apk', ''));
      formData.append('package', files[0].name.replace('.apk', ''));
      formData.append('version', '1.0.0');

      await api.post('/apps/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchApps();
    }
  });

  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Aplicativos</h3>
        <div {...getRootProps()} className="cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
          <input {...getInputProps()} />
          <FiUpload className="text-primary" />
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {apps.map((app: any) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-2 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FiPackage className="text-primary" />
              <div>
                <span className="text-sm text-white">{app.name}</span>
                <span className="text-xs text-gray-400 ml-2">v{app.version}</span>
              </div>
            </div>
            <button onClick={() => { if (confirm('Tem certeza?')) { api.delete(`/apps/${app.id}`); fetchApps(); } }} className="text-red-400 hover:text-red-300">
              <FiTrash2 />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
        }
