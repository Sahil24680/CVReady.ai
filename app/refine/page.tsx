"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  CloudArrowUpIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import AiSuggestionsPanel from "./components/AiSuggestionsPanel";
import { dummySuggestions } from "./DummyData";
import { toast } from "react-toastify";
import LoaderDocumentScan from "./components/LoaderDocumentScan";

// Client-only PDF viewer (avoids SSR issues)
const PdfDisplayArea = dynamic(() => import("./components/PdfDisplayArea"), {
  ssr: false,
  loading: () => (
    <LoaderDocumentScan
      message="Loading PDF viewer…"
      subtext="Please wait while we prepare the document"
    />
  ),
});

export default function Page() {
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateSinglePage = async (file: File): Promise<number> => {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
    return pdf.numPages;
  };

  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (file.type !== "application/pdf" || !name.endsWith(".pdf")) {
      toast.error("Only .pdf files are allowed.");
      ev.target.value = "";
      return;
    }

    try {
      const pages = await validateSinglePage(file);
      if (pages > 1) {
        toast.warning(
          `Your PDF has ${pages} pages. Please upload a single-page PDF only.`
        );
        ev.target.value = "";
        return;
      }
      setUploadedPdf(file);
    } catch (e) {
      console.error("PDF validation error:", e);
      toast.error("Could not read that PDF. Try another file.");
    } finally {
      ev.target.value = "";
    }
  };

  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hidden file input (parent-owned) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Toolbar  */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Resume Editor</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={openFilePicker}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <CloudArrowUpIcon className="w-4 h-4 mr-2" />
              Upload PDF
            </button>

            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 shadow-sm">
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Highlight Changes
            </button>

            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 shadow-sm">
              <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-indigo-600" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Main fills the rest; children can scroll */}
      <div className="flex-1 min-h-0 flex">
        {/* PDF column */}
        <div className="flex-1 min-h-0 p-3 overflow-auto">
          {uploadedPdf ? (
            <div className="flex justify-center">
              <div className="w-fit bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <PdfDisplayArea
                  uploadedPdf={uploadedPdf}
                  onUploadClick={openFilePicker}
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-screen items-center justify-center">
              <PdfDisplayArea
                uploadedPdf={uploadedPdf}
                onUploadClick={openFilePicker}
              />
            </div>
          )}
        </div>

        <AiSuggestionsPanel dummySuggestions={dummySuggestions} />
      </div>
    </div>
  );
}
