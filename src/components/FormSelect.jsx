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
  className = '',
  ...rest
}) {
  return (
    <div className="form-field">
      {label && (
        <label
          htmlFor={id || name}
          className="form-label"
        >
          {label}
          {required && <span className="field-required">*</span>}
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
        className={`form-control ${error ? 'form-control-invalid' : ''} ${className}`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormSelect;
