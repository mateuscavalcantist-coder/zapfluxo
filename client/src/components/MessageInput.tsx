import { useState, useRef, useEffect } from "react";
import { Smile, Plus, Mic } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focar no input ao carregar se não estiver desabilitado
  useEffect(() => {
    if (!disabled && inputRef.current) {
      // Pequeno delay para garantir renderização
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [disabled]);

  const playMessageSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Som "pop" curto e suave característico
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      playMessageSound();
      onSendMessage(message);
      setMessage("");
      // Manter foco após envio em desktop
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-2 min-h-[62px] border-t border-[#d1d7db]">
      <div className="flex gap-4 items-center text-[#54656f]">
        <button className="hover:text-[#111b21] transition-colors">
          <Smile size={26} strokeWidth={1.5} />
        </button>
        <button className="hover:text-[#111b21] transition-colors">
          <Plus size={26} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg px-3 py-2 mx-2 flex items-center min-h-[42px] border border-white focus-within:border-white">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Mensagem"
          className="w-full text-[15px] text-[#111b21] placeholder-[#8696a0] outline-none bg-transparent leading-5"
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-center w-10 h-10">
        {message.trim() ? (
          <button
            onClick={handleSend}
            className="text-[#54656f] hover:text-[#111b21] transition-colors"
            aria-label="Enviar"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" className="">
              <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
            </svg>
          </button>
        ) : (
          <button className="text-[#54656f] hover:text-[#111b21] transition-colors">
            <Mic size={26} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
