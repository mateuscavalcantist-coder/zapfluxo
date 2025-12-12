import { X } from "lucide-react";
import { useEffect } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  name: string;
}

export default function ProfileModal({ isOpen, onClose, imageUrl, name }: ProfileModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fadeIn backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Botão Fechar */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
      >
        <X size={32} />
      </button>

      {/* Container da Imagem */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar na imagem
      >
        {/* Barra superior com nome */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 text-white font-medium text-lg z-10">
          {name}
        </div>

        <img 
          src={imageUrl} 
          alt={name} 
          className="max-w-full max-h-[85vh] object-contain select-none pointer-events-none"
          onContextMenu={(e) => e.preventDefault()} // Desabilita clique direito
          draggable={false} // Desabilita arrastar
        />
      </div>
    </div>
  );
}
