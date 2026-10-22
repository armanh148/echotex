import React from 'react';
import { useStore } from '../store/useStore';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'light'
}) => {
  const { siteSettings } = useStore();
  const logo = siteSettings?.logoConfig || {
    wordmarkPrefix: 'ECO',
    wordmarkSuffix: 'TEX',
    badgeText: 'INC.',
    subtitle: 'Sustainable Packaging'
  };

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [siteSettings?.logoConfig?.customLogoUrl]);

  // Dimensions map for SVG icon fallback
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  // Custom logo image heights & max widths (preserves natural aspect ratio)
  const customHeights = {
    sm: 'h-8 sm:h-9 max-w-[170px] sm:max-w-[200px]',
    md: 'h-10 sm:h-12 max-w-[210px] sm:max-w-[260px]',
    lg: 'h-12 sm:h-14 max-w-[250px] sm:max-w-[300px]',
    xl: 'h-16 sm:h-20 max-w-[300px] sm:max-w-[380px]'
  };

  if (logo.customLogoUrl && !imageError) {
    if (variant === 'dark') {
      return (
        <div className={`inline-flex items-center select-none ${className}`}>
          <div className="inline-flex items-center px-3.5 py-1.5 sm:py-2 rounded-2xl bg-white shadow-md border border-white/20 transition-all duration-200 hover:scale-[1.02]">
            <img
              src={logo.customLogoUrl}
              alt={siteSettings?.companyName || 'Ecotex Inc.'}
              onError={() => setImageError(true)}
              className={`${customHeights[size]} w-auto object-contain object-left`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={logo.customLogoUrl}
          alt={siteSettings?.companyName || 'Ecotex Inc.'}
          onError={() => setImageError(true)}
          className={`${customHeights[size]} w-auto object-contain object-left transition-all duration-200`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Precision SVG rendering matching image (1) with 3 recycling arrows and center leaf */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 hover:rotate-12`}
        aria-hidden="true"
      >
        {/* Arrow 1: Top right band in rich deep forest green (#4E9F76) */}
        <path
          d="M 50 12 L 68 25 L 68 32 L 60 27 C 69 35 76 46 76 60 L 66 60 C 66 49 61 41 53 35 L 53 43 Z"
          fill="#4E9F76"
        />
        
        {/* Arrow 2: Bottom band in vibrant leaf green (#86C59E) */}
        <path
          d="M 80 66 L 73 86 L 66 84 L 71 76 C 60 83 47 84 34 78 L 38 69 C 48 74 58 73 66 68 L 59 66 Z"
          fill="#86C59E"
        />

        {/* Arrow 3: Left band pointing upwards in fresh mint (#B2E2C5) */}
        <path
          d="M 23 68 L 15 48 L 22 47 L 22 56 C 21 44 26 33 36 26 L 41 35 C 33 40 29 48 30 58 L 36 54 Z"
          fill="#B2E2C5"
        />

        {/* Center Organic Leaf: Tilted with leaf vein highlight */}
        <path
          d="M 42 60 C 42 60 40 45 52 38 C 64 31 66 42 64 49 C 62 56 52 62 42 60 Z"
          fill="#4E9F76"
        />
        <path
          d="M 43 59 C 49 53 54 47 62 40"
          stroke="#B2E2C5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-black tracking-tight ${textSizes[size]} ${
                variant === 'dark' ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              {logo.wordmarkPrefix || 'ECO'}
              <span className="text-[#4E9F76]">{logo.wordmarkSuffix || 'TEX'}</span>
            </span>
            <span
              className={`ml-1 text-[10px] font-bold tracking-widest uppercase ${
                variant === 'dark' ? 'text-[#B2E2C5]' : 'text-[#86C59E]'
              }`}
            >
              {logo.badgeText || 'INC.'}
            </span>
          </div>
          <span
            className={`text-[9px] tracking-wider uppercase font-semibold mt-0.5 ${
              variant === 'dark' ? 'text-slate-400' : 'text-[#4E9F76]'
            }`}
          >
            {logo.subtitle || 'Sustainable Packaging'}
          </span>
        </div>
      )}
    </div>
  );
};
