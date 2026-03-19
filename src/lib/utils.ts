import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapFiles = (files: File[]) => {
  return files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
  }));
};

export const IMAGE_TYPES = [
  "jpeg",
  "png",
  "bmp",
  "gif",
  "tiff",
  "webp",
  "avif",
  "heic",
  "ico",
  "svg",
  "pdf",
  "psd",
  "jp2",
  "jxl",
] as const;

export type IMAGE_TYPES = (typeof IMAGE_TYPES)[number];

export const urlToBase64 = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
};

export const formatFileName = (name: string) => {
  if (name.length <= 30) return name;

  const extIndex = name.lastIndexOf(".");
  const ext = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = name.slice(0, extIndex);
  const truncatedBase = baseName.length > 27 ? baseName.slice(0, 27) + "..." : baseName;

  return truncatedBase + ext;
};

export const downloadFile = async (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

export const FORMAT_CAPS = {
  jpeg: { read: true, write: true },
  png: { read: true, write: true },
  bmp: { read: true, write: true },
  gif: { read: true, write: true },
  tiff: { read: true, write: true },
  webp: { read: true, write: true },
  avif: { read: true, write: true },
  jp2: { read: true, write: true },
  ico: { read: true, write: true },

  svg: { read: true, write: false },
  pdf: { read: true, write: false },
  psd: { read: true, write: false },

  heic: { read: false, write: false },
  jxl: { read: false, write: false },
} as const;

export const canRead = (type: IMAGE_TYPES) => FORMAT_CAPS[type]?.read;
export const canWrite = (type: IMAGE_TYPES) => FORMAT_CAPS[type]?.write;

export const getValidOutputs = (src: IMAGE_TYPES) => {
  if (!canRead(src)) return [];

  return IMAGE_TYPES.filter((t) => canWrite(t));
};
