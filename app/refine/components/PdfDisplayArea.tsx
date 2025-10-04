"use client";

import React, { useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// PDF.js worker (.mjs)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfDisplayAreaProps {
  uploadedPdf: File | null;
  onUploadClick: () => void;
}

const PdfDisplayArea = ({
  uploadedPdf,
  onUploadClick,
}: PdfDisplayAreaProps) => {
  const [pageCssWidth, setPageCssWidth] = useState<number>();

  // ——— EMPTY STATE ———
  if (!uploadedPdf) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
            <CloudArrowUpIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No PDF Uploaded
          </h3>
          <p className="text-gray-500 mb-4">
            Upload a PDF to start editing your resume
          </p>
          <button
            onClick={onUploadClick}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            <CloudArrowUpIcon className="w-4 h-4 mr-2" />
            Choose File
          </button>
        </div>
      </div>
    );
  }

  // ——— VIEWER ———
  return (
    <div className="relative">
      <div
        className="overflow-auto p-4"
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        <Document
          file={uploadedPdf}
          loading={<div className="p-6">Loading PDF…</div>}
          error={<div className="p-6 text-red-600">Failed to load PDF.</div>}
        >
          <Page
            pageNumber={1}
            width={pageCssWidth}
            onLoadSuccess={(page) => {
              const viewport = page.getViewport({ scale: 1 });
              setPageCssWidth(viewport.width);
            }}
            renderAnnotationLayer
            renderTextLayer
            className="mx-auto shadow border rounded"
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfDisplayArea;
