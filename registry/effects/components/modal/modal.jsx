"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import "./modal.css";

export default function Modal({
  isOpen = false,
  onClose,
  children,
  className = "",
  contentClassName = "",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  closeButtonClassName = "",
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (closeOnEsc && event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeOnEsc, isOpen, onClose]);

  return (
    <div
      className={`custom-modal ${className} duration-500 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        className="custom-modal__backdrop"
        aria-label="Close modal"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div className={`custom-modal__content ${contentClassName}`}>
        {showCloseButton ? (
          <button
            type="button"
            className={`custom-modal__close ${closeButtonClassName}`}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
}
