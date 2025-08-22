import { cn } from "@mono/ui/utils";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

export const ImageNodeView: React.FC<ReactNodeViewProps> = ({
  node,
  selected,
}) => {
  return (
    <NodeViewWrapper
      className={cn(
        "my-8 w-full overflow-hidden rounded-xl",
        selected && "ring-2 ring-accent-500 ring-offset-2"
      )}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
      }}
      style={{
        aspectRatio: `${node.attrs.width} / ${node.attrs.height}`,
      }}
    >
      {node.attrs.loading ? (
        <div className="h-full w-full animate-pulse bg-neutral-100" />
      ) : (
        // biome-ignore lint/performance/noImgElement: no explanation
        <img
          alt={node.attrs.alt}
          className="not-prose h-full w-full"
          draggable={false}
          src={node.attrs.src}
        />
      )}
    </NodeViewWrapper>
  );
};
