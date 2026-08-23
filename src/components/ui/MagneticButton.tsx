import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.22;
    const y = (e.clientY - (top + height / 2)) * 0.22;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center font-sans tracking-widest-luxury uppercase transition-all duration-300 rounded-full select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-champagne-400 focus:ring-offset-2 overflow-hidden group font-semibold shrink-0";

  const sizeStyles = {
    sm: "h-10 px-5 text-[11px]",
    md: "h-12 px-7 text-xs",
    lg: "h-14 px-9 text-xs sm:text-sm",
  }[size];

  const variantStyles = {
    primary: "bg-obsidian text-pearl-100 hover:bg-obsidian-200 shadow-sm border border-obsidian",
    secondary: "bg-champagne-300 text-obsidian hover:bg-champagne-200 border border-champagne-400 shadow-pearl-glow",
    outline: "bg-pearl-50/80 text-obsidian border border-champagne-300/80 hover:border-gold-dark hover:bg-champagne-100/60",
    ghost: "bg-transparent text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/40",
  }[variant];

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Light sheen overlay */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform ease-out pointer-events-none" />
    </button>
  );
};
