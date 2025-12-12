/**
 * Analytics Tracking
 * 
 * Integração com Google Analytics e Facebook Pixel
 * para rastreamento de conversão do Typebot
 */

// Tipos de eventos rastreados
export type EventType = 
  | "page_view"
  | "form_start"
  | "name_entered"
  | "name_provided"
  | "question_answered"
  | "ai_question_answered"
  | "money_question_answered"
  | "conversion_completed"
  | "whatsapp_clicked"
  | "whatsapp_click";

interface EventData {
  [key: string]: string | number | boolean;
}

/**
 * Rastreia um evento no Google Analytics
 */
export const trackGoogleAnalyticsEvent = (
  eventName: string,
  eventData?: EventData
) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, eventData || {});
  }
};

/**
 * Rastreia um evento no Facebook Pixel
 */
export const trackFacebookPixelEvent = (
  eventName: string,
  eventData?: EventData
) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, eventData || {});
  }
};

/**
 * Rastreia um evento em ambas as plataformas
 */
export const trackConversionEvent = (
  eventType: EventType | string,
  eventData?: EventData
) => {
  const timestamp = new Date().toISOString();
  const data = {
    timestamp,
    ...eventData,
  };

  // Rastreia no Google Analytics
  trackGoogleAnalyticsEvent(eventType, data);

  // Rastreia no Facebook Pixel
  trackFacebookPixelEvent(eventType, data);

  // Log no console para debug
  console.log(`[Analytics] Event: ${eventType}`, data);
};

// Alias para trackConversionEvent para compatibilidade
export const trackEvent = trackConversionEvent;

/**
 * Eventos específicos do Typebot
 */
export const analytics = {
  // Quando o usuário entra na página
  pageView: () => {
    trackConversionEvent("page_view", {
      page_title: "Typebot - Produtos Virais com IA",
    });
  },

  // Quando o usuário começa a preencher o formulário
  formStart: () => {
    trackConversionEvent("form_start");
  },

  // Quando o usuário insere o nome
  nameEntered: (name: string) => {
    trackConversionEvent("name_entered", {
      user_name: name,
    });
  },

  // Quando o usuário responde a pergunta sobre IA
  aiQuestionAnswered: (answer: string) => {
    trackConversionEvent("ai_question_answered", {
      answer,
    });
  },

  // Quando o usuário responde a pergunta sobre ganhos
  moneyQuestionAnswered: (answer: string) => {
    trackConversionEvent("money_question_answered", {
      answer,
    });
  },

  // Quando o usuário completa o fluxo (conversão)
  conversionCompleted: (userName: string) => {
    trackConversionEvent("conversion_completed", {
      user_name: userName,
      value: 1, // Pode ser usado para rastrear valor de conversão
    });

    // Rastreia especificamente como conversão no Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: "Typebot Conversion",
        content_type: "product",
        value: 1,
        currency: "BRL",
      });
    }
  },

  // Quando o usuário clica em "acessar" (clica no link do WhatsApp)
  whatsappClicked: (userName: string) => {
    trackConversionEvent("whatsapp_clicked", {
      user_name: userName,
    });

    // Rastreia como compra/conversão no Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        content_name: "WhatsApp Access",
        content_type: "product",
        value: 1,
        currency: "BRL",
      });
    }
  },
};
