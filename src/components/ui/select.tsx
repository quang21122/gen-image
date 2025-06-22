import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  id,
  "aria-label": ariaLabel,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-left",
          "bg-white/50 dark:bg-white/10 border border-white/30 dark:border-white/20",
          "rounded-md transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400",
          "hover:bg-white/70 dark:hover:bg-white/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "ring-2 ring-primary-400 border-primary-400"
        )}
      >
        <span
          className={cn(
            "text-sm",
            selectedOption
              ? "text-secondary-900 dark:text-secondary-100"
              : "text-secondary-500 dark:text-secondary-400"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-secondary-500 dark:text-secondary-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options */}
          <div
            className="absolute top-full left-0 right-0 mt-1 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
            aria-label="Options"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors duration-200",
                  "hover:bg-primary-50 dark:hover:bg-primary-900/20",
                  "focus:outline-none focus:bg-primary-50 dark:focus:bg-primary-900/20",
                  option.value === value &&
                    "bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100"
                )}
              >
                <div className="font-medium text-secondary-900 dark:text-secondary-100">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
