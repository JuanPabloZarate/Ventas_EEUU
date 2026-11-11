'use client';

import React, { useState, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface FileUploadDropzoneProps {
  file: File | null;
  fileName?: string;
  fileSize?: number;
  previewUrl?: string;
  onFileSelect?: (file: File | null) => void;
  onFileSelected?: (file: File | null) => void;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function FileUploadDropzone({
  file,
  fileName,
  fileSize,
  onFileSelect,
  onFileSelected,
  maxSizeMB = 10,
  disabled = false,
  error,
  className = '',
}: FileUploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeName = file?.name || fileName;
  const activeSize = file?.size || fileSize;

  const handleEmitFile = (selected: File | null) => {
    if (onFileSelect) {
      onFileSelect(selected);
    } else if (onFileSelected) {
      onFileSelected(selected);
    }
  };

  const validateAndSelectFile = (selectedFile: File) => {
    setLocalError(null);
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (selectedFile.size > maxBytes) {
      setLocalError(`El archivo excede el tamaño máximo permitido (${maxSizeMB} MB).`);
      return;
    }

    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(selectedFile.type)) {
      setLocalError('Formato no soportado. Por favor sube un archivo PDF, JPG o PNG.');
      return;
    }

    handleEmitFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    handleEmitFile(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon name="receipt_long" size={22} className="text-secondary" />
          <h4 className="font-display text-sm sm:text-base font-bold text-brand-navy">
            Comprobante de Compra / Factura Comercial
          </h4>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
          Respaldo Aduanero
        </span>
      </div>

      <p className="font-sans text-xs text-on-surface-variant">
        Adjunta el recibo, captura de pantalla o invoice de la orden donde figure el monto pagado. Esto agiliza la desaduanización comercial en Bolivia.
      </p>

      {/* Selected File Card */}
      {activeName ? (
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-secondary/40 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
              <Icon name={activeName.endsWith('.pdf') ? 'picture_as_pdf' : 'image'} size={22} className="text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="font-sans text-xs sm:text-sm font-bold text-brand-navy truncate">
                {activeName}
              </p>
              <p className="font-mono text-xs text-on-surface-variant">
                {formatFileSize(activeSize)} • <span className="text-secondary font-medium">Listo para adjuntar</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-lg text-error hover:bg-error-container/30 transition-colors shrink-0 cursor-pointer"
            title="Eliminar comprobante"
            aria-label="Eliminar comprobante"
          >
            <Icon name="delete" size={20} />
          </button>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
            isDragActive
              ? 'border-secondary bg-secondary-fixed/20 scale-[0.99]'
              : 'border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low hover:border-secondary'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <Icon name="upload_file" size={26} className="text-secondary" />
          </div>
          <div>
            <p className="font-sans text-sm font-bold text-brand-navy">
              Haz clic o arrastra tu archivo aquí
            </p>
            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
              Formatos soportados: PDF, JPG, PNG (Hasta {maxSizeMB} MB)
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-secondary bg-surface-container-low px-3 py-1 rounded-full shadow-xs">
            <Icon name="add" size={14} /> Seleccionar desde tu dispositivo
          </span>
        </div>
      )}

      {/* Errors */}
      {(localError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-error font-medium">
          <Icon name="error" size={16} />
          <span>{localError || error}</span>
        </div>
      )}
    </div>
  );
}

export default FileUploadDropzone;
