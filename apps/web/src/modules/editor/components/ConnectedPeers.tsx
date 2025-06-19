import { Avatar } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import type { ConnectedPeer } from "../hooks/useHocuspocusProvider";

interface ConnectedPeersProps {
  connectedPeers: ConnectedPeer[];
}

export const ConnectedPeers: React.FC<ConnectedPeersProps> = ({
  connectedPeers,
}) => {
  return (
    <div className="flex items-center gap-2">
      {connectedPeers.map((peer) => {
        if (!peer.user) return null;

        return (
          <div className="relative" key={peer.clientId}>
            <Avatar.Root key={peer.user.id}>
              <Avatar.Image src={peer.user.image} />
              <Avatar.Fallback>{peer.user.name.slice(0, 1)}</Avatar.Fallback>
            </Avatar.Root>
            <div className="-right-0.5 -bottom-0.5 absolute flex size-3 items-center justify-center rounded-full bg-white p-0.75">
              <div
                className={cn(
                  "h-full w-full rounded-full",
                  peer.status === "online" && "bg-success-500",
                  peer.status === "away" && "bg-warning-500",
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
