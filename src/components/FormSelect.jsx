import React from 'react';

/**
 * Reusable FormSelect component
 * Handles select inputs with consistent styling and accessibility
 */
function FormSelect({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  error = null,
  disabled = false,
  placeholder = 'Select an option',
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition appearance-none ${
          error
            ? 'border-red-500 focus:ring-red-500 bg-red-50'
            : 'border-gray-300 focus:ring-red-500 focus:border-transparent'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormSelect;
