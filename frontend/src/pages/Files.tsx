import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUpload, FiTrash2, FiDownload, FiFolder, FiFile, FiEdit2 } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState('/');
  const [uploading, setUploading] = useState(false);
  const [renaming, setRenaming] = useState(null);

  const fetchFiles = async () => {
    const res = await api.get('/files', { params: { folder } });
    setFiles(res.data);
  };

  useEffect(() => { fetchFiles(); }, [folder]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('folder', folder);

      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploading(false);
      fetchFiles();
    }
  });

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await api.delete(`/files/${id}`);
      fetchFiles();
    }
  };

  const handleRename = async (id: string, newName: string) => {
    await api.put(`/files/${id}/rename`, { name: newName });
    setRenaming(null);
    fetchFiles();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Arquivos</h1>
        <div className="flex gap-3">
          <div {...getRootProps()} className="glass p-3 rounded-xl cursor-pointer hover:border-primary transition-colors border-2 border-dashed">
            <input {...getInputProps()} />
            <div className="flex items-center gap-2">
              <FiUpload className="text-primary" />
              <span>{uploading ? 'Enviando...' : 'Upload'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <FiFolder />
          <span>Caminho: {folder}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file: any) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-4 rounded-xl neon-border"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FiFile className="text-primary text-2xl" />
                <div>
                  {renaming === file.id ? (
                    <input
                      defaultValue={file.name}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRename(file.id, e.currentTarget.value);
                        }
                      }}
                      className="bg-dark/50 border border-gray-700 rounded px-2 py-1 text-white"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                  )}
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRenaming(file.id)} className="text-yellow-400 hover:text-yellow-300">
                  <FiEdit2 />
                </button>
                <button onClick={() => api.get(`/files/${file.id}/download`, { responseType: 'blob' }).then(res => {
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', file.name);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                })} className="text-blue-400 hover:text-blue-300">
                  <FiDownload />
                </button>
                <button onClick={() => handleDelete(file.id)} className="text-red-400 hover:text-red-300">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
