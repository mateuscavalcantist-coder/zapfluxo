interface ActionButtonProps {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

/**
 * ActionButton Component
 * 
 * Design: Minimalismo Funcional
 * - Botões para interação do Typebot
 * - Variantes: primary (verde WhatsApp), secondary (cinza)
 * - Animação de hover e click com elevação
 */
export default function ActionButton({
  text,
  onClick,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  const className =
    variant === "primary" ? "action-button-primary" : "action-button-secondary";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} min-w-[120px]`}
    >
      {text}
    </button>
  );
}
