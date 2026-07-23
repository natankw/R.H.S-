import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiFolder, FiFile, FiUpload, FiTrash2, FiDownload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

export default function FileManager({ onSelect }: { onSelect?: (file: any) => void }) {
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState('/');

  const fetchFiles = async () => {
    const res = await api.get('/files', { params: { folder } });
    setFiles(res.data);
  };

  useEffect(() => { fetchFiles(); }, [folder]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('folder', folder);
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchFiles();
    }
  });

  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <FiFolder />
          <span>{folder}</span>
        </div>
        <div {...getRootProps()} className="cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
          <input {...getInputProps()} />
          <FiUpload className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {files.map((file: any) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-2 rounded-lg flex items-center justify-between cursor-pointer hover:border-primary border border-transparent transition-colors"
            onClick={() => onSelect && onSelect(file)}
          >
            <div className="flex items-center gap-2">
              <FiFile className="text-blue-400" />
              <span className="text-sm text-white truncate">{file.name}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); api.get(`/files/${file.id}/download`, { responseType: 'blob' }); }} className="text-blue-400 hover:text-blue-300">
                <FiDownload size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm('Tem certeza?')) { api.delete(`/files/${file.id}`); fetchFiles(); } }} className="text-red-400 hover:text-red-300">
                <FiTrash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
        }
