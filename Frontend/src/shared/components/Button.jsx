import { cn } from '../utils/cn.js';

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-dots mr-2">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
