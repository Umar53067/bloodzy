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
        className={`form-control ${error ? 'form-control-invalid' : ''} ${className}`}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
