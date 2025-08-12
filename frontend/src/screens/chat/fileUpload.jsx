import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

const FileUpload = ({ onFileSelect, onCancel, uploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const supportedTypes = {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  };

  const allSupportedTypes = [...supportedTypes.image, ...supportedTypes.document];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!allSupportedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ file: ảnh (JPEG, PNG, WebP, GIF) và tài liệu (PDF, DOC, DOCX, TXT, XLS, XLSX)');
      return false;
    }

    if (file.size > maxFileSize) {
      toast.error('File không được vượt quá 10MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    if (supportedTypes.image.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('text')) return '📋';
    return '📎';
  };

  if (selectedFile) {
    return (
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">File đã chọn:</h4>
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-red-500 transition-colors"
            disabled={uploading}
          >
            ✕
          </button>
        </div>

        {/* File Preview */}
        <div className="mb-4">
          {previewUrl ? (
            // Image preview
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg object-contain"
              />
            </div>
          ) : (
            // Document info
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <div className="text-2xl">{getFileIcon(selectedFile.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSend}
            disabled={uploading}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
            ) : (
              'Gửi file'
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={uploading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleInputChange}
        accept={allSupportedTypes.join(',')}
        className="hidden"
      />

      <div className="space-y-4">
        <div className="text-4xl">📎</div>
        <div>
          <p className="text-lg font-medium text-gray-800 mb-1">
            Chọn file để gửi
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Kéo thả file vào đây hoặc nhấp để chọn
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Chọn file
          </button>
        </div>
        <div className="text-xs text-gray-400">
          <p>Hỗ trợ: Ảnh (JPEG, PNG, WebP, GIF), Tài liệu (PDF, DOC, DOCX, TXT, XLS, XLSX)</p>
          <p>Dung lượng tối đa: 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
