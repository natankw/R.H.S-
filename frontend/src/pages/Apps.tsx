import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUpload, FiTrash2, FiPackage, FiHardDrive } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

export default function Apps() {
  const [apps, setApps] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchApps = async () => {
    const res = await api.get('/apps');
    setApps(res.data);
  };

  useEffect(() => { fetchApps(); }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/vnd.android.package-archive': ['.apk'] },
    onDrop: async (files) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('name', files[0].name.replace('.apk', ''));
      formData.append('package', files[0].name.replace('.apk', ''));
      formData.append('version', '1.0.0');

      await api.post('/apps/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploading(false);
      fetchApps();
    }
  });

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await api.delete(`/apps/${id}`);
      fetchApps();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Aplicativos</h1>
        <div {...getRootProps()} className="glass p-4 rounded-xl cursor-pointer hover:border-primary transition-colors border-2 border-dashed">
          <input {...getInputProps()} />
          <div className="flex items-center gap-2">
            <FiUpload className="text-primary" />
            <span>{uploading ? 'Enviando...' : 'Enviar APK'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app: any) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-4 rounded-xl neon-border"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FiPackage className="text-primary text-3xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                  <p className="text-xs text-gray-400">{app.package}</p>
                  <p className="text-xs text-gray-500">v{app.version}</p>
                  <p className="text-xs text-gray-500"><FiHardDrive className="inline" /> {(app.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => handleDelete(app.id)} className="text-red-400 hover:text-red-300">
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
        }
