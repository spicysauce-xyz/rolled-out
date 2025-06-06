import { AnimatePresence, motion } from "motion/react";
import { forwardRef } from "react";

const TransitionRoot: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {children}
    </AnimatePresence>
  );
};

const TransitionItem = forwardRef<
  React.ComponentRef<typeof motion.div>,
  React.ComponentProps<typeof motion.div>
>(({ ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      {...props}
    />
  );
});

export { TransitionRoot as Root, TransitionItem as Item };
