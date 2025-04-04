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
import { cn, tv } from "../../utils";
import { IconButton } from "../icon-button";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const toastVariants = tv({
  slots: {
    iconContainer:
      "flex size-5 shrink-0 items-center justify-center rounded-full",
    icon: "size-4",
  },
  variants: {
    variant: {
      accent: {
        iconContainer: "bg-accent-50",
        icon: "text-accent-500",
      },
      neutral: {
        iconContainer: "bg-neutral-50",
        icon: "text-neutral-500",
      },
      success: {
        iconContainer: "bg-success-50",
        icon: "text-success-500",
      },
      error: {
        iconContainer: "bg-danger-50",
        icon: "text-danger-500",
      },
      warning: {
        iconContainer: "bg-warning-50",
        icon: "text-warning-500",
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
      <Icon className={cn(icon(), className)} />
    </div>
  );
};

const ToasterRoot = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="group/toast"
      icons={{
        close: (
          <IconButton.Root variant="tertiary" size="sm">
            <IconButton.Icon>
              <XIcon />
            </IconButton.Icon>
          </IconButton.Root>
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
          "rounded-xl flex w-100 flex-col gap-2 py-4 pl-11 pr-12.5 bg-white border border-neutral-100 shadow-xl ring-0",
        classNames: {
          closeButton: "absolute top-2 right-2 outline-none",
          title: "text-sm font-weight-500 text-neutral-900",
          description: "text-xs font-weight-400 text-neutral-500",
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
