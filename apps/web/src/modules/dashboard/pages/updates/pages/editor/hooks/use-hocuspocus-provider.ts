import { HocuspocusProvider } from "@hocuspocus/provider";
import { config } from "@lib/config";
import { useEffect, useRef, useState } from "react";
import type * as Y from "yjs";

export interface ConnectedPeer {
  clientId: string;
  status: "online" | "away";
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export const useHocuspocusProvider = (
  organizationId: string,
  documentName: string
):
  | { isReady: false }
  | {
      isReady: true;
      title: string;
      provider: HocuspocusProvider;
      connectedUsers: ConnectedPeer[];
      hasUnsyncedChanges: boolean;
    } => {
  const providerRef = useRef<HocuspocusProvider | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<ConnectedPeer[]>([]);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false);

  useEffect(() => {
    if (providerRef.current) {
      return;
    }

    providerRef.current = new HocuspocusProvider({
      url: `${config.hocusUrl}/${organizationId}`,
      name: documentName,
      onSynced: () => {
        setIsReady(true);
      },
      onAwarenessUpdate: ({ states }) => {
        setConnectedUsers(states as unknown as ConnectedPeer[]);
      },
      onUnsyncedChanges: (data) => {
        setHasUnsyncedChanges(!!data.number);
      },
    });

    return () => {
      providerRef.current?.destroy();
    };
  }, [documentName, organizationId]);

  useEffect(() => {
    if (!providerRef.current) {
      return;
    }

    const provider = providerRef.current;

    const onVisibility = () =>
      provider.setAwarenessField("status", document.hidden ? "away" : "online");

    onVisibility();

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const handle = (doc: Y.Doc) => {
      const yContent = doc.getXmlFragment("default");

      if (yContent.length) {
        const titleNode = (yContent.get(0) as Y.XmlElement).get(0);

        setTitle(titleNode.toString() ?? "");
      }
    };

    if (providerRef.current?.document) {
      const provider = providerRef.current;
      handle(providerRef.current.document);

      const listener = (_: unknown, __: unknown, document: Y.Doc) => {
        handle(document);
      };

      provider.document.on("update", listener);

      return () => {
        provider.document.off("update", listener);
      };
    }

    return;
  }, []);

  if (!isReady) {
    return { isReady };
  }

  return {
    provider: providerRef.current as HocuspocusProvider,
    title,
    connectedUsers,
    hasUnsyncedChanges,
    isReady,
  };
};
