import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Alert,
  ProgressBar,
  ListGroup,
  Badge
} from 'react-bootstrap';
import {
  Upload,
  X,
  FileText,
  Image,
  File,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  showPreview?: boolean;
  uploadProgress?: { [key: string]: number };
  uploadStatus?: { [key: string]: 'uploading' | 'success' | 'error' };
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
  maxFileSize = 10, // 10MB
  maxFiles = 5,
  multiple = true,
  showPreview = true,
  uploadProgress = {},
  uploadStatus = {},
  disabled = false,
  className = ''
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.startsWith('image/')) {
      return <Image size={20} className="text-primary" />;
    } else if (type.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText size={20} className="text-danger" />;
    } else if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) {
      return <FileText size={20} className="text-info" />;
    } else {
      return <File size={20} className="text-muted" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `حجم الملف يتجاوز الحد الأقصى المسموح (${maxFileSize}MB)`;
    }

    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && !acceptedTypes.includes(extension)) {
      return `نوع الملف غير مدعوم. الأنواع المدعومة: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (files: FileList) => {
    setError(null);
    const newFiles: File[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);

      if (validation) {
        errors.push(`${file.name}: ${validation}`);
      } else {
        newFiles.push(file);
      }
    }

    // Check total file count
    const totalFiles = selectedFiles.length + newFiles.length;
    if (totalFiles > maxFiles) {
      errors.push(`عدد الملفات يتجاوز الحد الأقصى المسموح (${maxFiles} ملفات)`);
      return;
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;
    setSelectedFiles(updatedFiles);
    onFileSelect?.(updatedFiles);
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileRemove?.(index);
    onFileSelect?.(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const getStatusIcon = (fileName: string) => {
    const status = uploadStatus[fileName];
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-success" />;
      case 'error':
        return <AlertCircle size={16} className="text-danger" />;
      case 'uploading':
        return <div className="spinner-border spinner-border-sm text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <Card
        className={`mb-3 ${dragOver ? 'border-primary bg-light' : ''} ${disabled ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Card.Body className="text-center py-4">
          <Upload size={48} className="text-muted mb-3" />
          <h5>اسحب الملفات هنا أو</h5>
          <Button
            variant="outline-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            اختر الملفات
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.map(type => `.${type}`).join(',')}
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
          <div className="mt-3 text-muted small">
            <div>الأنواع المدعومة: {acceptedTypes.join(', ')}</div>
            <div>الحد الأقصى للحجم: {maxFileSize}MB</div>
            <div>الحد الأقصى للعدد: {maxFiles} ملفات</div>
          </div>
        </Card.Body>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </Alert>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && showPreview && (
        <Card>
          <Card.Header>
            <h6 className="mb-0">الملفات المحددة ({selectedFiles.length})</h6>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {selectedFiles.map((file, index) => (
                <ListGroup.Item key={`${file.name}-${index}`}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      {getFileIcon(file)}
                      <div className="ms-3">
                        <div className="fw-medium">{file.name}</div>
                        <small className="text-muted">
                          {formatFileSize(file.size)}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      {getStatusIcon(file.name)}
                      {uploadProgress[file.name] !== undefined && (
                        <div className="me-2" style={{ width: '100px' }}>
                          <ProgressBar
                            now={uploadProgress[file.name]}
                            size="sm"
                            variant={uploadStatus[file.name] === 'error' ? 'danger' : 'primary'}
                          />
                        </div>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleFileRemove(index)}
                        disabled={disabled || uploadStatus[file.name] === 'uploading'}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}