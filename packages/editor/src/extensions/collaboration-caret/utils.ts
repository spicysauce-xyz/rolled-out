export const renderCollaborationCaret = (peer: {
  color: string;
  name: string;
}) => {
  const cursor = document.createElement("span");

  cursor.classList.add("border-x", "-mx-px", "relative");
  cursor.setAttribute("style", `border-color: ${peer.color}`);

  const label = document.createElement("div");

  label.classList.add(
    "rounded-sm",
    "text-sm",
    "leading-4",
    "font-weight-500",
    "left-1/2",
    "-translate-x-1/2",
    "line-height-normal",
    "px-1",
    "py-0.5",
    "absolute",
    "-top-5",
    "user-select-none",
    "whitespace-nowrap"
  );

  label.setAttribute("style", `background-color: ${peer.color}`);
  label.insertBefore(document.createTextNode(peer.name), null);
  cursor.insertBefore(label, null);

  return cursor;
};
