import { IoClose } from "react-icons/io5";
import GlassPanel from "./figma/GlassPanel";

// components/Modal.js
export default function Modal({ onClose,isLoading, children }: { onClose: () => void, isLoading: boolean, children: React.ReactNode }) {
    return (
      <div className={`fixed inset-0  z-50 flex  justify-center bg-black bg-opacity-50 ${isLoading ? 'items-center' : 'items-end sm:items-center'}`}>
        <GlassPanel className={`!p-4 !rounded-[16px] bg-gradient-to-r  from-[#252525] via-[#1e1e1e] to-[#121212] ${isLoading ? 'w-auto' : 'w-full sm:w-auto'} `}>
          {!isLoading && <button className="absolute top-4 right-4" onClick={onClose}>
                <IoClose className="text-white size-6"/>
            </button>}
          {children}
        </GlassPanel>
      </div>
    );
  }
  