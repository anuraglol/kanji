import { DownloadIcon, X } from "lucide-react";
import * as React from "react";

import { filesCollection, type FileItem } from "@/db-collections";
import { Button } from "./ui/button";
import { downloadFile, formatFileName } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export function FileItem({ file }: { file: FileItem }) {
  const formattedSize = React.useCallback((size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => await downloadFile(file.data, file.name),
  });

  return (
    <div className="w-full p-3 rounded-md border-border border flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={file.data} alt={file.name} className="size-36 rounded-xs object-cover" />

        <div className="text-[13px] font-medium flex flex-col">
          {formatFileName(file.name)}
          <p className="text-[11px] text-muted-foreground">
            {formattedSize(file.size)}, {file.type.split("/")[1].toUpperCase()}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {new Date(file.lastModified).getDate()}{" "}
            {new Date(file.lastModified).toLocaleString("default", { month: "short" })}{" "}
            {new Date(file.lastModified).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <Button
            className="w-36 mt-4"
            variant="outline"
            onClick={() => mutate()}
            disabled={isPending}
          >
            <DownloadIcon className="size-4" data-icon="inline-start" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => {
            filesCollection.delete(file.id);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
