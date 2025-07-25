import React, { useState, useRef, useEffect } from 'react';
import classes from './util-components.module.css'; // updated import

const FilterableDropdown = ({
  options = [],
  onSelect,
  placeholder,
  disabled,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (selectedOption) => {
    setInputValue(selectedOption.label);
    setShowOptions(false);
    onSelect?.(selectedOption.id);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={classes.dropdown} ref={dropdownRef}>
      <input
        type="text"
        className={classes.input}
        placeholder={placeholder || 'Select option...'}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={disabled}
        onClick={() => setShowOptions(true)}
        {...rest}
      />
      {showOptions && (
        <div className={classes.options}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={classes.option}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className={classes['no-option']}>No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterableDropdown;
