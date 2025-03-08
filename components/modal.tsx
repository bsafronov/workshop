import { useBoolean } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  title: string;
  description?: string;
  children?: ((toggle: () => void) => React.ReactNode) | React.ReactNode;
  trigger?: (toggle: () => void) => React.ReactNode;
  open?: boolean;
};

export type ModalProps = {
  trigger?: (toggle: () => void) => React.ReactNode;
};

export const Modal = ({
  title,
  trigger,
  children,
  description,
  open,
}: Props) => {
  const { value, toggle } = useBoolean(open);

  return (
    <Dialog open={value} onOpenChange={toggle}>
      {trigger && (
        <DialogTrigger asChild onClick={toggle}>
          {trigger?.(toggle)}
        </DialogTrigger>
      )}
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 bg-accent border-b grid place-items-center">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="p-6">
          {typeof children === "function" ? children(toggle) : children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
