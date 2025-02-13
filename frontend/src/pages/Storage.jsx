import { useState, useEffect } from "react";
import { 
  ArrowUpTrayIcon,
  DocumentIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {getStorage, uploadFiles } from "../actions/storageAction";

// Add sample data


export default function Storage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchStorage();
    // Use sample data instead of API call
  }, []);

  const fetchStorage = async() =>{
    setLoading(true);
    const response = await getStorage();
    setFiles(response);
    if(response)
      setLoading(false);
  }
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadingFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (uploadingFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    try {
      const formData = new FormData();
      uploadingFiles.forEach(file => {
        formData.append('files', file);
      });
      uploadFiles(formData);
      toast.success("Files uploaded successfully");
      setShowUploadModal(false);
      setUploadingFiles([]);
      await fetchStorage();
      }
      // Refresh the file list
     catch (error) {
      toast.error("Failed to upload files");
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Storage</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          Upload Files
        </button>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last modified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage class</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.Key} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{file.Key}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(file.LastModified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBytes(file.Size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.StorageClass}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[480px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upload Files</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, or other files</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {uploadingFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Selected Files:</h3>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="space-y-2">
                    {uploadingFiles.map((file, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <DocumentIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({formatBytes(file.size)})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadingFiles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Upload {uploadingFiles.length > 0 && `(${uploadingFiles.length} files)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
