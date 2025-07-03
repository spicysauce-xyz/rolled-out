import { UpdateEntry } from "@modules/dashboard/components/update-list";

interface BoardUpdateProps {
  order: number;
  title: string;
  tags: { tag: { label: string } }[];
  editors: { user: { id: string; name: string; image: string | null } }[];
  publishedAt: string | null;
}

export const BoardUpdate: React.FC<BoardUpdateProps> = ({
  order,
  title,
  tags,
  editors,
  publishedAt,
}) => {
  return (
    <UpdateEntry.Root>
      <UpdateEntry.Group>
        <UpdateEntry.Number number={order} />
        <UpdateEntry.Title title={title} />
      </UpdateEntry.Group>
      <UpdateEntry.Tags
        className="flex-1"
        tags={tags.map(({ tag }) => tag.label)}
      />
      <UpdateEntry.Meta>
        {editors.length > 0 && <UpdateEntry.Editors editors={editors} />}
        {publishedAt && (
          <UpdateEntry.Date date={publishedAt} label="Published on" />
        )}
      </UpdateEntry.Meta>
    </UpdateEntry.Root>
  );
};
