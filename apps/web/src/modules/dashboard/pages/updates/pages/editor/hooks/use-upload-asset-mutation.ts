import { api } from "@lib/api";
import { Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";

export const useUploadAssetMutation = () => {
  const { mutateAsync: createUploadUrl } = useMutation({
    mutationFn: async (file: File) => {
      const response = await api.assets.image.$post({
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

  const { mutateAsync: uploadAsset } = useMutation({
    mutationFn: async (data: { file: File; uploadUrl: string }) => {
      const { file, uploadUrl } = data;

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload asset");
      }

      return response.url;
    },
  });

  return async (file: File) => {
    const toastId = Toaster.loading("Uploading asset...");

    try {
      const { uploadUrl, url } = await createUploadUrl(file);

      await uploadAsset({ file, uploadUrl });

      Toaster.success("Asset uploaded", { id: toastId });

      return url;
    } catch (error) {
      Toaster.error("Failed to upload asset", { id: toastId });
      throw error;
    }
  };
};
