import React, { useEffect, useRef, useState } from "react";

interface ModalProps {
    isOpen: boolean;
    hasCloseBtn?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
  };



const Modal: React.FC<ModalProps> = ({ isOpen, hasCloseBtn, onClose, children }) => 
{
    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);
    
    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
          if (isModalOpen) {
            modalElement.showModal();
          } else {
            modalElement.close();
          }
        }
      }, [isModalOpen]);

      const handleCloseModal = () => {
        if (onClose) {
          onClose();
        }
        setModalOpen(false);
      };

      const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
          handleCloseModal();
        }
      };
      
      return (
        <dialog ref={modalRef} onKeyDown={handleKeyDown} className="modal">
          {hasCloseBtn && (
            <button className="modal-close-btn" onClick={handleCloseModal}>
              X
            </button>
          )}
          {children}
        </dialog>
      );
};
export default Modal;