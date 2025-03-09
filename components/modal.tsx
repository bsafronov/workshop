"use client";

import { createContext, useContext } from "react";
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
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
};

const ModalContext = createContext<ReturnType<typeof useBoolean> | null>(null);
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a <Modal />");
  }

  return ctx;
};

export const Modal = ({
  title,
  trigger,
  children,
  description,
  open,
}: Props) => {
  const isOpen = useBoolean(open);

  return (
    <ModalContext.Provider value={isOpen}>
      <Dialog open={isOpen.value} onOpenChange={isOpen.toggle}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          className="p-0 overflow-hidden gap-0"
          aria-describedby={undefined}
        >
          <DialogHeader className="p-6 bg-accent border-b grid place-items-center">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="p-6">{children}</div>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};
