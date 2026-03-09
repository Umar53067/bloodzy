import React from 'react';

/**
 * Reusable Button component
 * Supports multiple variants and states with consistent styling
 */
function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  className = '',
  ariaLabel,
  ...props
}) {
  const baseStyles = 'btn';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const buttonClass = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'btn-full' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={buttonClass}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin mr-2">⟳</span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
