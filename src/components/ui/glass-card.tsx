import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  blur?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  blur = 'md',
  className,
  children,
  ...props
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const variantClasses = {
    default: 'bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10',
    elevated: 'bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-glass',
    bordered: 'bg-white/5 dark:bg-white/5 border-2 border-white/30 dark:border-white/20',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/10',
        blurClasses[blur],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
