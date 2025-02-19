import React, { useState, useRef, useEffect } from "react";

const MultiSelect = ({ options, selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="border rounded-lg p-2 bg-inherit cursor-pointer"
        onClick={handleToggleDropdown}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <span
              key={option}
              className="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
            >
              {option}
            </span>
          ))
        ) : (
          <span className="text-gray-500">Select options</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                selectedOptions.includes(option) ? "bg-blue-100" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <span className="block truncate">{option}</span>
              {selectedOptions.includes(option) && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
