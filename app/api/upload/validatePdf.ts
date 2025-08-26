import { PDFDocument } from "pdf-lib";

export type PdfValidationResult =
  | { ok: true; bytes: Uint8Array; pageCount: number }
  | { ok: false; error: string; status: number };

/**
 * Validates that a file is a single-page PDF and under the given size.
 * Returns a structured result
 */
export async function validateSinglePagePdf(
  file: File,
  maxBytes: number,
  maxSizeLabel = "1MB" 
): Promise<PdfValidationResult> {
  
  if (!(file instanceof File)) {
    return { ok: false, error: "No file uploaded", status: 400 };
  }

  // Size
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `File too large. Must be under ${maxSizeLabel}.`,
      status: 400,
    };
  }

  // Type + extension (strict PDF)
  const isPdfMime = file.type === "application/pdf";
  const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMime || !isPdfExt) {
    return {
      ok: false,
      error: "Only PDF files are allowed.",
      status: 400,
    };
  }

  // Bytes
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length === 0) {
    return { ok: false, error: "Empty file.", status: 400 };
  }

  // Readable + page count
  let pageCount = 0;
  try {
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    pageCount = pdfDoc.getPageCount();
  } catch {
    return { ok: false, error: "Could not read PDF.", status: 400 };
  }

  if (pageCount !== 1) {
    return {
      ok: false,
      error: "Please upload a single-page PDF.",
      status: 400,
    };
  }

  return { ok: true, bytes, pageCount };
}
