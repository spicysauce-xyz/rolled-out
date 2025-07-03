import { AnimatePresence, motion } from "motion/react";
import { forwardRef } from "react";

const TransitionRoot: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AnimatePresence initial={false} mode="popLayout">
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
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      ref={ref}
      transition={{ duration: 0.15 }}
      {...props}
    />
  );
});

export { TransitionRoot as Root, TransitionItem as Item };
