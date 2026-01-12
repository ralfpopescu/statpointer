'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  icon?: ReactNode;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  icon,
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-body font-medium
    rounded-xl transition-all duration-300 relative overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-ember to-rose text-white
      shadow-lg shadow-ember/25
      hover:shadow-xl hover:shadow-ember/40
      before:absolute before:inset-0 before:bg-white/10 before:opacity-0
      hover:before:opacity-100 before:transition-opacity
    `,
    secondary: `
      bg-slate border-2 border-ember/50 text-ember
      hover:bg-ember/10 hover:border-ember
    `,
    ghost: `
      bg-transparent text-mist
      hover:text-chalk hover:bg-slate/50
    `,
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

