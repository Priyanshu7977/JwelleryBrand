import React from 'react';

interface LuxuryBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'pearl' | 'blush' | 'obsidian';
  className?: string;
  dot?: boolean;
}

export const LuxuryBadge: React.FC<LuxuryBadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
  dot = true,
}) => {
  const variantStyles = {
    gold: 'bg-champagne-100/80 text-obsidian border-champagne-300/80',
    pearl: 'bg-pearl-100/90 text-obsidian border-white/80 backdrop-blur-sm',
    blush: 'bg-blush-100/80 text-obsidian border-blush-200',
    obsidian: 'bg-obsidian text-pearl-100 border-obsidian-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] uppercase font-medium tracking-widest-luxury border shadow-sm ${variantStyles} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-gold-dark animate-pulse" />
      )}
      <span>{children}</span>
    </span>
  );
};
