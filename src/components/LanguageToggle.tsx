/**
 * Language Toggle Component
 *
 * Provides UI for switching between English and Korean languages
 * Implements the contract defined in specs/002-src-data-resume/contracts/language-toggle.ts
 */

import React from "react";
import { Language, LANGUAGE_LABELS } from "../hooks/useLanguageToggle";

export interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
  variant?: "text" | "button";
}

/**
 * Language toggle component for switching between English and Korean
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
  className = "",
  variant = "text",
}) => {
  const handleToggle = () => {
    const newLanguage = currentLanguage === "en" ? "ko" : "en";
    onLanguageChange(newLanguage);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const baseClasses = [
    "inline-flex",
    "items-center",
    "gap-1",
    "cursor-pointer",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",
    "rounded",
    "transition-colors",
    "duration-150",
  ];

  const variantClasses =
    variant === "button"
      ? [
          "px-3",
          "py-1",
          "bg-gray-100",
          "hover:bg-gray-200",
          "border",
          "border-gray-300",
        ]
      : ["px-1", "py-0.5", "hover:bg-gray-50"];

  const combinedClasses = [...baseClasses, ...variantClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      data-testid="language-toggle"
      className={combinedClasses}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Toggle language between English and Korean"
    >
      <span
        className={
          currentLanguage === "en"
            ? "text-blue-600 font-medium"
            : "text-gray-600 hover:text-gray-800"
        }
      >
        {LANGUAGE_LABELS.en.short}
      </span>

      <span className="text-gray-400 select-none">|</span>

      <span
        className={
          currentLanguage === "ko"
            ? "text-blue-600 font-medium"
            : "text-gray-600 hover:text-gray-800"
        }
      >
        {LANGUAGE_LABELS.ko.short}
      </span>
    </div>
  );
};

/**
 * Alternative language toggle component with full language names
 */
export const LanguageToggleFull: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={() => onLanguageChange("en")}
        className={`px-3 py-1 rounded transition-colors ${
          currentLanguage === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-pressed={currentLanguage === "en"}
      >
        {LANGUAGE_LABELS.en.full}
      </button>

      <button
        onClick={() => onLanguageChange("ko")}
        className={`px-3 py-1 rounded transition-colors ${
          currentLanguage === "ko"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-pressed={currentLanguage === "ko"}
      >
        {LANGUAGE_LABELS.ko.full}
      </button>
    </div>
  );
};

export default LanguageToggle;
