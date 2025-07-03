import { api } from "@lib/api";
import { Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useMemo, useState } from "react";

type IdleState = { state: "idle" };
type UploadingState = {
  state: "uploading";
  progress: number;
  preview: string;
};
type FileUploadState = IdleState | UploadingState;

interface FileUploadProps {
  id: string;
  type: keyof typeof api.assets;
  accept?: string;
  limit?: number;
  onUploadComplete?: (url: string) => void;
  children: (
    options: {
      id: string;
    },
    state: FileUploadState
  ) => React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  type,
  children,
  onUploadComplete,
  accept,
  limit = 10,
}) => {
  const [state, setState] = useState<
    "idle" | "uploading" | "complete" | "error"
  >("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const initiateUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await api.assets[type].$post({
        query: {
          type: file.type,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxSize = limit * 1024 * 1024;
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > maxSize) {
      Toaster.error("The file is too large", {
        description: `File size must be less than ${limit}MB`,
      });
      return;
    }

    const { uploadUrl, url } = await initiateUploadMutation.mutateAsync(file);

    setPreview(URL.createObjectURL(file));
    setProgress(0);
    setState("uploading");
    const toastId = Toaster.loading("Uploading...");

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(true);
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error"));
        };

        xhr.ontimeout = () => {
          reject(new Error("Timeout"));
        };

        xhr.onabort = () => {
          reject(new Error("Aborted"));
        };

        xhr.send(file);
      });

      Toaster.loading("Verifying...", { id: toastId });

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
          resolve(true);
        };

        img.onerror = () => {
          reject(new Error("Network error"));
        };

        img.onabort = () => {
          reject(new Error("Aborted"));
        };
      });

      onUploadComplete?.(url);
      Toaster.success("Upload successful", { id: toastId });
    } catch (error) {
      Toaster.error(error instanceof Error ? error.message : "Unknown error", {
        id: toastId,
      });
    } finally {
      setState("idle");
    }
  };

  const externalState: FileUploadState = useMemo(() => {
    switch (state) {
      case "uploading":
        return { state: "uploading", preview: preview || "", progress };

      default:
        return { state: "idle" };
    }
  }, [state, progress, preview]);

  return (
    <>
      {children(
        {
          id,
        },
        externalState
      )}
      <input
        accept={accept ?? "image/*"}
        className="hidden"
        id={id}
        onChange={handleFileChange}
        type="file"
      />
    </>
  );
};
