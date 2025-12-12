/**
 * TypingIndicator Component
 * 
 * Design: Cópia Fiel WhatsApp Web
 * - Balão branco arredondado
 * - Três pontos cinzas (#8696a0) animados
 * - SVG para renderização nítida
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2 animate-fadeIn">
      <div className="bg-white rounded-tr-lg rounded-br-lg rounded-bl-lg px-4 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] relative max-w-[80px] flex items-center justify-center h-[38px]">
        {/* Triângulo do balão (canto superior esquerdo) */}
        <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[0px] border-r-[12px] border-b-[12px] border-l-[0px] border-t-transparent border-r-white border-b-transparent border-l-transparent filter drop-shadow-[-1px_1px_0_rgba(11,20,26,0.13)]"></div>
        
        {/* Pontos animados */}
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
