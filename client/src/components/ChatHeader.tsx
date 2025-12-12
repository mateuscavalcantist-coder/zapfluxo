import { Search, MoreVertical, ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  contactName: string;
  status: string;
  avatarUrl?: string;
  onProfileClick?: () => void;
}

/**
 * ChatHeader Component - Cópia Fiel WhatsApp Web
 * Fundo cinza claro #f0f2f5, texto escuro, ícones cinza #54656f
 */
export default function ChatHeader({
  contactName,
  status,
  avatarUrl,
  onProfileClick,
}: ChatHeaderProps) {
  return (
    <div className="bg-[#f0f2f5] px-4 py-2.5 flex items-center justify-between border-b border-[#d1d7db] z-10 relative flex-shrink-0 h-[60px]">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Botão Voltar (Apenas visual, pois é web) */}
        <button className="p-1 rounded-full text-[#54656f] md:hidden">
          <ArrowLeft size={24} />
        </button>

        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-black/5 p-1 rounded-lg transition-colors -ml-1"
          onClick={onProfileClick}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={contactName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
          )}
          
          <div className="flex flex-col justify-center overflow-hidden">
            <h2 className="font-normal text-[#111b21] text-[16px] leading-tight truncate">
              {contactName}
            </h2>
            <p className="text-[13px] text-[#667781] leading-tight truncate">
              {status}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-shrink-0 pr-2">
        <button className="text-[#54656f]" aria-label="Search">
          <Search size={20} strokeWidth={2} />
        </button>
        <button className="text-[#54656f]" aria-label="More options">
          <MoreVertical size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
