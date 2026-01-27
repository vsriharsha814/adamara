"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomDropdown({
  options,
  value,
  onChange,
  label,
  name,
  required = false,
  error = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setFocusedIndex(-1);
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        if (focusedIndex + 1 < options.length) {
          optionsRef.current[focusedIndex + 1]?.scrollIntoView({
            block: "nearest",
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        if (focusedIndex > 0) {
          optionsRef.current[focusedIndex - 1]?.scrollIntoView({
            block: "nearest",
          });
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          onChange({ target: { name, value: options[focusedIndex].value } });
          setIsOpen(false);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleItemClick = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const handleItemKeyDown = (e, optionValue) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange({ target: { name, value: optionValue } });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={`${name}-button`}
          className="mb-1 block font-medium text-gray-900 dark:text-slate-100"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        id={`${name}-button`}
        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-controls={isOpen ? `${name}-options` : undefined}
      >
        <span className={`block truncate ${!value ? "text-gray-500 dark:text-slate-400" : ""}`}>
          {selectedOption ? selectedOption.label : "Select an option"}
        </span>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={`${name}-options`}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg focus:outline-none dark:border dark:border-white/10 dark:bg-slate-900"
          tabIndex={-1}
          role="listbox"
          aria-labelledby={`${name}-label`}
          style={{ top: "calc(100% + 4px)", left: 0 }}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => (optionsRef.current[index] = el)}
              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                focusedIndex === index
                  ? "bg-blue-50 outline outline-2 outline-blue-500 dark:bg-blue-500/10"
                  : ""
              } ${
                option.value === value
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100"
                  : "text-gray-900 dark:text-slate-100"
              }`}
              id={`${name}-option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
              onClick={() => handleItemClick(option.value)}
              onKeyDown={(e) => handleItemKeyDown(e, option.value)}
            >
              <span className="block truncate">{option.label}</span>
              {option.value === value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-300">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

