import { initializeImageMagick, ImageMagick, MagickFormat } from "@imagemagick/magick-wasm";
import type { IMAGE_TYPES } from "./utils";

let initialized = false;
let initPromise: Promise<void> | null = null;

const wasmUrl = "/magick.wasm";
async function init() {
  if (initialized) return;

  if (!initPromise) {
    initPromise = fetch(wasmUrl)
      .then((r) => r.arrayBuffer())
      .then((bytes) => initializeImageMagick(new Uint8Array(bytes)))
      .then(() => {
        initialized = true;
      })
      .finally(() => {
        initPromise = null;
      });
  }

  await initPromise;
}

export async function convertImage(srcBytes: Uint8Array, dstType: string): Promise<Uint8Array> {
  await init();

  const FORMAT_MAP: Partial<Record<IMAGE_TYPES, MagickFormat>> = {
    jpeg: MagickFormat.Jpeg,
    png: MagickFormat.Png,
    bmp: MagickFormat.Bmp,
    gif: MagickFormat.Gif,
    tiff: MagickFormat.Tiff,
    webp: MagickFormat.WebP,
    avif: MagickFormat.Avif,
    jp2: MagickFormat.Jp2,
    ico: MagickFormat.Ico,
  };

  const fmt = FORMAT_MAP[dstType as IMAGE_TYPES];

  if (!fmt) {
    throw new Error(`Format ${dstType} not supported by Magick WASM`);
  }

  return new Promise<Uint8Array>((resolve, reject) => {
    try {
      ImageMagick.read(srcBytes, (image) => {
        try {
          image.write(fmt!, (data) => {
            resolve(data);
          });
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      console.error("Error converting image:", e);
      reject(e);
    }
  });
}
