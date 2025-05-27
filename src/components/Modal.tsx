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
      // Only close if not a loading modal
      if (!isLoading && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-[9999] flex justify-center items-end sm:items-center bg-black/60 p-0 sm:p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className={`${isLoading ? 'w-auto' : 'w-full sm:w-auto'} max-w-full sm:max-w-[90vw] max-h-[95vh] sm:max-h-[90vh] flex justify-center`}
          onClick={(e) => e.stopPropagation()}
        >
          <GlassPanel className="relative !p-0 !rounded-t-2xl sm:!rounded-2xl !bg-black/40 !backdrop-blur-xl !border-white/10 !border-b-0 sm:!border-b w-full">
            {!isLoading && (
              <button 
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all duration-200" 
                onClick={() => {
                  console.log('Close button clicked - calling onClose');
                  onClose();
                }}
                type="button"
                aria-label="Close modal"
              >
                <IoClose className="text-white size-5 sm:size-6"/>
              </button>
            )}
            <div className="p-6 overflow-y-auto max-h-[85vh]">
              {children}
            </div>
          </GlassPanel>
        </div>
      </div>
    );
  }
  
