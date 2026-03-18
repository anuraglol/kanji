import { createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import { z } from "zod";

const FileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
  data: z.string(),
  id: z.string(),
});

export type FileItem = z.infer<typeof FileSchema>;

export const filesCollection = createCollection(
  localStorageCollectionOptions({
    id: "files",
    storageKey: "app-files",
    getKey: (item) => item.id,
    schema: FileSchema,
  }),
);
