import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  label, 
  name, 
  required = false,
  error = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Reset focused index when dropdown opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);
  
  // Get selected option label
  const selectedOption = options.find(option => option.value === value);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        );
        if (focusedIndex + 1 < options.length) {
          optionsRef.current[focusedIndex + 1]?.scrollIntoView({ block: 'nearest' });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        if (focusedIndex > 0) {
          optionsRef.current[focusedIndex - 1]?.scrollIntoView({ block: 'nearest' });
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          onChange({ target: { name, value: options[focusedIndex].value }});
          setIsOpen(false);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };
  
  // Handle item click
  const handleItemClick = (optionValue) => {
    onChange({ target: { name, value: optionValue }});
    setIsOpen(false);
  };
  
  // Handle item keyboard selection
  const handleItemKeyDown = (e, optionValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange({ target: { name, value: optionValue }});
      setIsOpen(false);
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={`${name}-button`} className="block mb-1 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        id={`${name}-button`}
        className={`w-full flex items-center justify-between px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-controls={isOpen ? `${name}-options` : undefined}
      >
        <span className={`block truncate ${!value ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : 'Select an option'}
        </span>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <ul
          id={`${name}-options`}
          className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 focus:outline-none"
          tabIndex="-1"
          role="listbox"
          aria-labelledby={`${name}-label`}
          style={{ top: 'calc(100% + 4px)', left: 0 }}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={el => (optionsRef.current[index] = el)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                focusedIndex === index ? 'bg-blue-50' : ''
              } ${
                option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
              } ${
                focusedIndex === index ? 'outline outline-2 outline-blue-500' : ''
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
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomDropdown;