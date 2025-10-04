"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";

export default function TranscriptBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Transcript</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
          aria-label="Copy transcript"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 max-h-64 overflow-y-auto">
        <p className="text-sm text-gray-800 leading-relaxed font-mono">{text}</p>
      </div>
    </div>
  );
}
