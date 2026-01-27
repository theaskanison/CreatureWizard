import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-300 text-blue-900 border-blue-900",
    secondary: "bg-white hover:bg-gray-100 text-blue-900 border-blue-200",
    danger: "bg-red-500 hover:bg-red-400 text-white border-red-700",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};