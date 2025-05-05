import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  Loader2Icon,
  type LucideIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../../utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const toastVariants = tv({
  slots: {
    iconContainer: "flex size-5 shrink-0 items-center justify-center",
    icon: "size-4",
  },
  variants: {
    variant: {
      accent: {
        icon: "text-accent-400",
      },
      neutral: {
        icon: "text-neutral-200",
      },
      success: {
        icon: "text-success-400",
      },
      error: {
        icon: "text-danger-400",
      },
      warning: {
        icon: "text-warning-400",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const ToastIcon = ({
  variant,
  icon: Icon,
  className,
}: VariantProps<typeof toastVariants> & {
  icon: LucideIcon;
  className?: string;
}) => {
  const { iconContainer, icon } = toastVariants({ variant });

  return (
    <div className={iconContainer()}>
      <Icon className={icon({ className })} />
    </div>
  );
};

const ToasterRoot = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="group/toast"
      position="bottom-center"
      icons={{
        close: (
          <div className="flex size-9 shrink-0 items-center justify-center text-neutral-200 transition-all hover:text-white">
            <XIcon className="size-4" />
          </div>
        ),
        success: <ToastIcon variant="success" icon={CheckCircle2Icon} />,
        error: <ToastIcon variant="error" icon={XCircleIcon} />,
        warning: <ToastIcon variant="warning" icon={AlertCircleIcon} />,
        info: <ToastIcon variant="neutral" icon={InfoIcon} />,
        loading: (
          <ToastIcon
            variant="neutral"
            icon={Loader2Icon}
            className="animate-spin"
          />
        ),
      }}
      toastOptions={{
        unstyled: true,
        closeButton: true,
        className:
          "rounded-xl flex w-full mx-auto flex-col gap-2 py-4 pl-11 pr-12.5 bg-neutral-900 shadow-xl ring-0",
        classNames: {
          closeButton: "absolute top-2 right-2 outline-none",
          title: "text-sm font-weight-500 text-white",
          description: "text-xs font-weight-400 text-neutral-200",
          icon: "size-5 flex items-center ml-0 mr-0 absolute top-4 left-4",
          content: "flex flex-col gap-0.5",
        },
      }}
      offset={24}
      {...props}
    />
  );
};

const { success, error, warning, info, loading } = sonnerToast;

export { ToasterRoot as Root, success, error, warning, info, loading };
