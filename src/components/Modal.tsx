import { IoClose } from "react-icons/io5";
import GlassPanel from "./figma/GlassPanel";
import { useEffect } from "react";

// components/Modal.js
export default function Modal({
  onClose,
  isLoading,
  persistent = false,
  children
}: {
  onClose: () => void,
  isLoading: boolean,
  persistent?: boolean,
  children: React.ReactNode
}) {
    // Add/remove no-scroll class to body when modal mounts/unmounts
    useEffect(() => {
      document.body.style.overflow = 'hidden';

      // Cleanup function to remove the style when component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    // Handle clicking outside the modal to close it
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Only close if not a loading modal and not persistent
      if (!isLoading && !persistent && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className={`fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 ${isLoading ? 'items-center' : 'items-end sm:items-center'}`}
        onClick={handleBackdropClick}
      >
        <GlassPanel className={`!p-4 !rounded-[16px] bg-gradient-to-r max-h-screen overflow-y-auto from-[#252525] via-[#1e1e1e] to-[#121212] ${isLoading ? 'w-auto' : 'w-full sm:w-auto'} `}>
          {!isLoading && <button className="absolute top-4 right-4" onClick={onClose}>
                <IoClose className="text-white size-6"/>
            </button>}
          {children}
        </GlassPanel>
      </div>
    );
  }
  