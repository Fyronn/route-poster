"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";

type ModalProps = {
  children: React.ReactNode;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({
  children,
  description,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  const scrollYRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    scrollYRef.current = window.scrollY;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.removeEventListener("keydown", handleKeyDown);
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div aria-modal="true" role="dialog">
      <button
        aria-label="Modal arka planını kapat"
        onClick={onClose}
        style={{
          backdropFilter: "blur(6px)",
          background: "rgba(15, 23, 42, 0.5)",
          border: 0,
          cursor: "default",
          inset: 0,
          padding: 0,
          position: "fixed",
          zIndex: 9998,
        }}
        type="button"
      />
      <div
        className="w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        style={{
          left: "50%",
          maxHeight: "calc(100dvh - 3rem)",
          overflowY: "auto",
          position: "fixed",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          <Button
            aria-label="Kapat"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
