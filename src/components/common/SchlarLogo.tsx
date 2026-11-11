import React from 'react';

interface SchlarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  schoolSubtitle?: string;
  className?: string;
}

export const SchlarLogo: React.FC<SchlarLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showTagline = false,
  schoolSubtitle = 'Greenfield International School',
  className = ''
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subtextSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs'
  };

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : variant === 'dark' ? 'text-slate-900' : 'text-slate-900 dark:text-white';
  const subtextColor = isLight ? 'text-slate-300' : variant === 'dark' ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Academic Mark */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl flex items-center justify-center shadow-xs transition-transform relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary, #164E55) 0%, var(--color-secondary, #287B7A) 100%)',
          color: '#ffffff'
        }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4 drop-shadow-sm"
        >
          {/* Geometric Diamond Foundation */}
          <path
            d="M20 4L34 16L20 28L6 16L20 4Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          {/* Inner Prism Refraction */}
          <path
            d="M20 10L28 17L20 24L12 17L20 10Z"
            fill="var(--color-accent, #C47D54)"
          />
          {/* Upward Growth Apex */}
          <path
            d="M20 14L24 18L20 22L16 18L20 14Z"
            fill="#FFFFFF"
          />
          {/* Lower Connected Pedestal / Open Book Geometry */}
          <path
            d="M10 24L20 33L30 24L27 28L20 36L13 28L10 24Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${textSizes[size]} ${textColor} font-sans`}>
            SCHLAR
          </span>
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: 'var(--color-accent, #C47D54)' }}
          >
            SaaS
          </span>
        </div>

        {schoolSubtitle && (
          <span className={`${subtextSizes[size]} ${subtextColor} font-medium tracking-tight truncate mt-0.5 max-w-[200px] sm:max-w-none`}>
            {schoolSubtitle}
          </span>
        )}

        {showTagline && (
          <span className="text-[10px] text-slate-400 tracking-normal mt-0.5">
            Unified School Management Platform
          </span>
        )}
      </div>
    </div>
  );
};
