"use client";

import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  /** Classes Tailwind para largura máxima, ex.: max-w-[560px] */
  maxWidthClass?: string;
  className?: string;
};

/**
 * Modal em `document.body`: overlay cobre viewport inteira (incl. sidebar),
 * centrado com flex, scroll interno no conteúdo.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidthClass = "max-w-[520px]",
  className,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) {
      document.body.style.paddingRight = `${scrollbarW}px`;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div className="flex min-h-[100dvh] w-full min-w-0 max-w-[100vw] items-start justify-center overflow-x-hidden overflow-y-auto px-4 py-4 sm:items-center sm:px-6 sm:py-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "animate-modal-in mx-auto flex w-full min-w-0 max-h-[min(90dvh,90vh)] flex-col overflow-hidden rounded-2xl border border-terra-200 bg-white shadow-2xl",
            maxWidthClass,
            className,
          )}
        >
          <div className="flex shrink-0 items-start gap-3 border-b border-terra-200 px-6 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-8">
            {icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-verde-50 text-verde-600">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-lg font-bold leading-tight tracking-tight text-terra-950">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-1 text-[13px] leading-snug text-terra-400">{subtitle}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-terra-600 transition-interactive hover:bg-terra-100 hover:text-terra-900"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6 [scrollbar-gutter:stable]">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
