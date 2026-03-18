import { set, del, entries } from "idb-keyval";
import { z } from "zod";

const FileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
  data: z.instanceof(Blob),
  id: z.string(),
});

export type FileItem = z.infer<typeof FileSchema>;

export const filesStore = {
  getAll: (): Promise<FileItem[]> => entries<string, FileItem>().then((e) => e.map(([, v]) => v)),
  insert: (item: FileItem) => set(item.id, item),
  delete: (id: string) => del(id),
};
