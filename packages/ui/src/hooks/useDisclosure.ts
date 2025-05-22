import { useState } from "react";

export const useDisclosure = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle, setOpen: setIsOpen };
};
