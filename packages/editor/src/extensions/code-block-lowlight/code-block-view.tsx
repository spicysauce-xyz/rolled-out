import { Button, Select } from "@mono/ui";
import {
  NodeViewContent,
  NodeViewWrapper,
  type ReactNodeViewProps,
} from "@tiptap/react";

export const CodeBlockView: React.FC<ReactNodeViewProps> = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => (
  <NodeViewWrapper className="group/code-block relative">
    <Select.Root
      onValueChange={(value) => updateAttributes({ language: value })}
      value={defaultLanguage}
    >
      <Select.Trigger
        className="absolute top-4 right-4 opacity-0 transition-opacity group-hover/code-block:opacity-100 data-[state=open]:opacity-100"
        render={<Button.Root type="button" variant="tertiary" />}
      >
        <Select.Value />
        <Button.Icon render={<Select.Icon />} />
      </Select.Trigger>
      <Select.Content className="h-64">
        {extension.options.lowlight.listLanguages().map((lang: string) => (
          <Select.Item key={lang} value={lang}>
            <Select.ItemText>{lang}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>

    <pre>
      <NodeViewContent
        as="code"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{ whiteSpace: "pre" }}
      />
    </pre>
  </NodeViewWrapper>
);
