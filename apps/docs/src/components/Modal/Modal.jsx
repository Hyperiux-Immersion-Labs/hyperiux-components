"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({
    isOpen = false,
    onClose,
    children,
    className = "",
    contentClassName = "",
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEsc = true,
    closeButtonClassName = "",
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (closeOnEsc && e.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose, closeOnEsc]);

    // if (!isOpen) return null;

    return (
        <div className={`custom-modal ${className} duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"}`}>
            <button
                type="button"
                className="custom-modal__backdrop"
                aria-label="Close modal"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            <div className={`custom-modal__content ${contentClassName}`}>
                {showCloseButton && (
                    <button
                        type="button"
                        className={`custom-modal__close ${closeButtonClassName}`}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                )}

                {children}
            </div>
        </div>
    );
};

export default Modal;