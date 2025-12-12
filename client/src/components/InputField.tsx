import React, { useState } from "react";
import { Send } from "lucide-react";

interface InputFieldProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

/**
 * InputField Component
 * 
 * Design: Minimalismo Funcional
 * - Campo de entrada para o Typebot
 * - Botão de envio integrado
 * - Animação de focus
 */
export default function InputField({
  placeholder,
  onSubmit,
  disabled = false,
}: InputFieldProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-green-300 transition-all"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="p-2 hover:bg-green-50 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
      >
        <Send size={20} className="text-green-500" />
      </button>
    </div>
  );
}
