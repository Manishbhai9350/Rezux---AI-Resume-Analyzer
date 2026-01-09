
export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

export function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only run in the browser");
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      const pdfjsLib = await import("pdfjs-dist");
      const pdfWorker = await import(
        "pdfjs-dist/build/pdf.worker?url"
      );

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;
      return pdfjsLib;
    })();
  }

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({
      canvasContext: context,
      viewport,
      canvas, // ✅ REQUIRED
    }).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({
            imageUrl: "",
            file: null,
            error: "Failed to create image blob",
          });
          return;
        }

        const imageFile = new File(
          [blob],
          file.name.replace(/\.pdf$/i, ".png"),
          { type: "image/png" }
        );

        resolve({
          imageUrl: URL.createObjectURL(blob),
          file: imageFile,
        });
      }, "image/png", 1.0);
    });
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${String(err)}`,
    };
  }
}
