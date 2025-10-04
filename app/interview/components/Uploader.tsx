"use client";

import React, { useRef } from "react";
import { FileAudio, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

export default function Uploader({
  onFileSelect,
  file,
  onRemove,
}: {
  onFileSelect: (file: File) => void;
  file: File | null;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // duration check before accepting file
      const audio = document.createElement("audio");
      audio.src = URL.createObjectURL(selectedFile);
      audio.onloadedmetadata = () => {
        if (audio.duration > 180) {
          // 180 seconds = 3 minutes
          toast.error("Audio file must be under 3 minutes."); //  Added toast warning
          return;
        }
        onFileSelect(selectedFile);
      };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (file) {
    return (
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileAudio className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
          aria-label="Remove file"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="w-full border-2 border-dashed border-blue-200 rounded-xl p-8 text-center transition-colors duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 touch-pan-y"
        aria-label="Choose an audio file to upload"
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Click to choose your audio file
        </p>
        <p className="text-xs text-gray-500">Supports MP3, WAV, M4A (max 50MB, under 3 minutes)</p>
      </button>
    </div>
  );
}
