import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export default function SearchableDropdown({
  label,
  id,
  options = [], // array of strings or { label, value }
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  disabled = false,
  required = false,
  error = '',
  allowCustom = false,
  customPlaceholder = 'Or type custom name...',
  helperText = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to { label, value }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });

  // Filtered options based on search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Find currently selected label
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value || '';

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setHighlightedIndex(-1);
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex].value);
      } else if (allowCustom && searchTerm.trim()) {
        handleSelect(searchTerm.trim());
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="w-full relative font-sans" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs sm:text-[13px] font-bold text-[#123B68] mb-1.5 flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-red-500 font-bold">*</span>}
          </span>
          {disabled && (
            <span className="text-[11px] text-[#60758A] font-normal italic">
              (Select preceding field first)
            </span>
          )}
        </label>
      )}

      {/* Main Field Button */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white text-left text-sm rounded border flex items-center justify-between transition-all duration-150 focus:outline-none ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : error
            ? 'border-red-500 ring-1 ring-red-500'
            : isOpen
            ? 'border-[#2878B8] ring-2 ring-[#2878B8]/20 shadow-sm'
            : 'border-[#D9E4ED] hover:border-[#2878B8] text-[#17324D]'
        }`}
      >
        <span className={`block truncate ${!displayLabel ? 'text-gray-400' : 'font-medium text-[#123B68]'}`}>
          {displayLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {displayLabel && !disabled && (
            <span
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear selection"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleClear(e);
              }}
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-[#60758A] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#123B68]' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-md border border-[#D9E4ED] shadow-xl z-50 overflow-hidden animate-fade-in">
          {/* Search Input */}
          <div className="p-2 border-b border-[#D9E4ED] bg-[#F8FAFC]">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8] focus:ring-1 focus:ring-[#2878B8]"
              />
            </div>
          </div>

          {/* Options List */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-y-auto py-1 text-xs sm:text-sm divide-y divide-gray-50 focus:outline-none"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between transition-colors min-h-[40px] ${
                      isSelected
                        ? 'bg-[#EEF7FC] text-[#123B68] font-bold border-l-4 border-[#F58220]'
                        : isHighlighted
                        ? 'bg-[#F0F6FA] text-[#123B68]'
                        : 'text-[#17324D] hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check size={15} className="text-[#F58220] flex-shrink-0 ml-2" />}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-center text-xs text-gray-500">
                <span>No matching location found.</span>
                {allowCustom && searchTerm.trim() && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(searchTerm.trim())}
                      className="px-3 py-1.5 bg-[#123B68] text-white rounded text-xs font-semibold hover:bg-[#2878B8] transition-colors"
                    >
                      Use "{searchTerm.trim()}"
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Allow custom write-in bottom bar if enabled */}
          {allowCustom && (
            <div className="p-2 border-t border-[#D9E4ED] bg-[#F8FAFC] flex items-center gap-2">
              <input
                type="text"
                placeholder={customPlaceholder}
                className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-[#D9E4ED] rounded focus:outline-none focus:border-[#2878B8]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    handleSelect(e.target.value.trim());
                  }
                }}
              />
              <span className="text-[10px] text-gray-500">Press Enter</span>
            </div>
          )}
        </div>
      )}

      {/* Helper text or validation message */}
      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#60758A]">{helperText}</p>
      ) : null}
    </div>
  );
}
