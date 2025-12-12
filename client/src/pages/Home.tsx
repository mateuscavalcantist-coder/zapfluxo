import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";
import MessageInput from "@/components/MessageInput";
import TypingIndicator from "@/components/TypingIndicator";
import ActionButton from "@/components/ActionButton";
import ProfileModal from "@/components/ProfileModal";
import { trackEvent } from "@/lib/analytics";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface Message {
  id: number;
  text: string;
  isSent: boolean;
  timestamp: string;
  isRead?: boolean;
  type: "text" | "buttons" | "action";
  options?: string[];
  actionText?: string;
  selectedOption?: string; // Para controlar qual opção foi escolhida
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Hook de efeitos sonoros
  const { playSentSound, playReceivedSound } = useSoundEffects();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial message
  useEffect(() => {
    trackEvent("page_view");
    
    // Sequência inicial com animação de digitação fixa curta
    const startFlow = async () => {
      const msg1 = "PARABÉNS POR TER CHEGADO ATÉ AQUI! 🎉 Conheça agora PRODUTOS VIRAIS capazes de colocar de R$ 180,00 a R$ 300,00 no seu bolso com I.A!";
      
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Tempo fixo curto para mostrar bolhas
      setIsTyping(false);
      
      const initialMessage: Message = {
        id: 1,
        text: msg1,
        isSent: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      setMessages([initialMessage]);
      playReceivedSound(); // Som de recebimento da primeira mensagem
      
      // Segunda mensagem (pergunta nome)
      const msg2 = "Me diga seu nome?";
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa curta entre mensagens
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Tempo fixo curto para mostrar bolhas
      setIsTyping(false);
      
      const nameRequest: Message = {
        id: 2,
        text: msg2,
        isSent: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      setMessages(prev => [...prev, nameRequest]);
      playReceivedSound(); // Som de recebimento da segunda mensagem
      
      setInputDisabled(false); // Habilita o input para o usuário digitar o nome
      trackEvent("form_start");
    };

    startFlow();
  }, []);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false, // Mensagem enviada pelo usuário fica com um check cinza inicialmente
      type: "text",
    };

    setMessages((prev) => {
      // Se a mensagem anterior era de botões, marcamos que foi respondida para esconder os botões
      const updatedMessages = prev.map(msg => {
        if (msg.type === "buttons" && !msg.selectedOption) {
          return { ...msg, selectedOption: text };
        }
        return msg;
      });
      return [...updatedMessages, newMessage];
    });
    
    playSentSound(); // Som de envio
    setInputDisabled(true); // Desabilita input enquanto bot processa
    
    // Simular delay de leitura (check azul)
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? {...m, isRead: true} : m));
    }, 1000);

    handleBotResponse(text);
  };

  const handleBotResponse = async (userResponse: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let responseText = "";
    let nextMessage: Message | null = null;

    if (step === 0) {
      setUserName(userResponse);
      setStep(1);
      trackEvent("name_provided");
      responseText = `${userResponse}, Show! Já ouviu falar de INTELIGÊNCIA ARTIFICIAL?`;
      
      nextMessage = {
        id: Date.now() + 1,
        text: responseText,
        isSent: false,
        timestamp,
        type: "buttons",
        options: ["Sim, já ouvi", "Ainda não"],
      };
    } else if (step === 1) {
      setStep(2);
      trackEvent("question_answered", { question: "ai_knowledge", answer: userResponse });
      responseText = `${userName}, faz sentido pra você fazer pelo menos R$ 280,00 REAIS todo dia usando INTELIGÊNCIA ARTIFICIAL pra vender PRODUTOS VIRAIS?`;

      nextMessage = {
        id: Date.now() + 1,
        text: responseText,
        isSent: false,
        timestamp,
        type: "buttons",
        options: ["Sim, claro", "Com certeza"],
      };
    } else if (step === 2) {
      setStep(3);
      trackEvent("question_answered", { question: "income_interest", answer: userResponse });
      responseText = `Parabéns ${userName}! Seu acesso foi validado! Clique abaixo para pegar seu acesso no whatsapp...`;

      nextMessage = {
        id: Date.now() + 1,
        text: responseText,
        isSent: false,
        timestamp,
        type: "action",
        actionText: "ACESSAR AGORA",
      };
      trackEvent("conversion_completed");
    }

    if (nextMessage) {
      setIsTyping(true);
      // Delay fixo curto apenas para mostrar as bolhas de digitação
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      setMessages((prev) => [...prev, nextMessage!]);
      playReceivedSound(); // Som de recebimento da resposta do bot
    }
  };

  const handleActionClick = () => {
    trackEvent("whatsapp_click");
    // Redireciona para WhatsApp
    window.open(
      "https://wa.me/5584991041207?text=Olá! Gostaria de saber mais sobre os produtos virais com IA.",
      "_blank"
    );
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#efeae2] overflow-hidden relative">
      {/* Background Pattern Overlay com Fade-in */}
      <div className="absolute inset-0 opacity-60 pointer-events-none z-0 animate-fadeIn" 
           style={{ 
             backgroundImage: "url('/images/whatsapp-bg-minimal.jpeg')", 
             backgroundSize: "cover",
             backgroundRepeat: "no-repeat",
             backgroundPosition: "center",
             animationDuration: "1.5s"
           }} 
      />

      {/* Header - Fixo no topo */}
      <div className="z-20 w-full">
        <ChatHeader
          contactName="Mateus Klose"
          status="online"
          avatarUrl="/images/mateus-profile.jpg"
          onProfileClick={() => setIsProfileOpen(true)}
        />
      </div>

      {/* Messages Area - Scrollável */}
      <div className="flex-1 overflow-y-auto z-10 relative scroll-smooth">
        <div className="max-w-3xl mx-auto py-4 px-2 sm:px-4 pb-4">
          {/* Encryption Message */}
          <div className="flex justify-center mb-6 mt-2">
            <div className="bg-[#ffeecd] text-[#54656f] text-[10px] sm:text-xs px-3 py-1.5 rounded-lg shadow-sm text-center max-w-[90%] leading-tight">
              🔒 As mensagens são protegidas com criptografia de ponta a ponta.
            </div>
          </div>

          {messages.map((message) => (
            <div key={message.id} className="mb-1 animate-slideUp">
              {message.type === "text" ? (
                <MessageBubble
                  text={message.text}
                  timestamp={message.timestamp}
                  isSent={message.isSent}
                  isRead={message.isRead}
                />
              ) : message.type === "buttons" ? (
                <div className="flex flex-col gap-2">
                  <MessageBubble
                    text={message.text}
                    timestamp={message.timestamp}
                    isSent={message.isSent}
                  />
                  {/* Botões só aparecem se nenhuma opção foi selecionada ainda */}
                  {!message.selectedOption && (
                    <div className="flex flex-wrap gap-2 justify-center mt-1 mb-2 animate-fadeIn">
                      {message.options?.map((option) => (
                        <ActionButton
                          key={option}
                          text={option}
                          onClick={() => handleSendMessage(option)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : message.type === "action" ? (
                <div className="flex flex-col gap-2">
                  <MessageBubble
                    text={message.text}
                    timestamp={message.timestamp}
                    isSent={message.isSent}
                  />
                  <div className="flex justify-center mt-2 mb-4">
                    <button
                      onClick={handleActionClick}
                      className="bg-[#00a884] hover:bg-[#008f6f] text-white font-bold py-3 px-8 rounded-full shadow-md transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      {message.actionText}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.77.476 3.435 1.306 4.885L2.006 22l5.248-1.368A9.953 9.953 0 0 0 12.001 22C17.524 22 22 17.522 22 12c0-5.522-4.476-10-9.999-10z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-2 animate-slideUp">
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixo no fundo */}
      <div className="z-20 w-full bg-[#f0f2f5]">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={inputDisabled}
        />
      </div>

      {/* Modal de Perfil */}
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        imageUrl="/images/mateus-profile.jpg"
        name="Mateus Klose"
      />
    </div>
  );
}
