import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

/**
 * MessageBubble Component - Pixel Perfect WhatsApp Web
 * - Enviadas: #d9fdd3
 * - Recebidas: #ffffff
 * - Sombra: 0 1px 0.5px rgba(11,20,26,.13)
 * - Radius: 7.5px
 */
export default function MessageBubble({
  text,
  timestamp,
  isSent,
  isRead = false,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1 px-[6%] sm:px-[8%]`}>
      <div 
        className={`relative px-2 py-1.5 max-w-[85%] sm:max-w-[65%] rounded-lg shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-[14.2px] leading-[19px] text-[#111b21]
          ${isSent ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"}
        `}
      >
        {/* Triângulo do balão (pseudo-elemento simulado com SVG ou borda seria ideal, mas CSS border radius hack funciona bem) */}
        {isSent ? (
          <span className="absolute top-0 -right-2 w-2 h-3 bg-[#d9fdd3] [clip-path:polygon(0_0,0_100%,100%_0)]"></span>
        ) : (
          <span className="absolute top-0 -left-2 w-2 h-3 bg-white [clip-path:polygon(0_0,100%_0,100%_100%)]"></span>
        )}

        <div className="flex flex-wrap items-end gap-x-2 relative z-10">
          <span className="whitespace-pre-wrap break-words">{text}</span>
          <div className="flex items-center gap-0.5 ml-auto h-4 self-end -mb-1">
            <span className="text-[11px] text-[#667781] min-w-fit">{timestamp}</span>
            {isSent && (
              <span className={`ml-0.5 ${isRead ? "text-[#53bdeb]" : "text-[#667781]"}`}>
                {isRead ? (
                  <CheckCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Check size={15} strokeWidth={1.5} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
