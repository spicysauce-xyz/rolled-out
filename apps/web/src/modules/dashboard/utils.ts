import { config } from "@lib/config";

export const getPublicUrl = (organizationSlug: string): string => {
  const url = config.publicUrl;
  const [protocol, rest] = url.split("//");

  if (!rest) {
    return "";
  }

  return `${protocol}//${organizationSlug}.${rest}`;
};
