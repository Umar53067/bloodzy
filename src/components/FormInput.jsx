import React from 'react';

/**
 * Reusable FormInput component
 * Handles text, email, password, tel, and number inputs
 * Provides consistent styling and accessibility features
 */
function FormInput({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  disabled = false,
  min,
  max,
  pattern,
  autoComplete,
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
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        pattern={pattern}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-red-500 focus:ring-red-500 bg-red-50'
            : 'border-gray-300 focus:ring-red-500 focus:border-transparent'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
