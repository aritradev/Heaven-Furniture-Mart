'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

/**
 * Custom HEAVEN FURNITURE MART Vector Logo Component
 * Recreates the brand wordmark featuring the stylized golden furniture 'A'
 * with optimized line-height spacing and subtext font size for crisp legibility.
 */
export default function Logo({
  height = 48,
  textColor = 'currentColor',
  accentColor = '#EAA023',
  subtextColor = 'currentColor',
  className = '',
  showSubtext = true,
  ...props
}) {
  const t = useTranslations('common');

  return (
    <svg
      height={height}
      viewBox="0 0 340 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={t('logoAlt')}
      role="img"
      {...props}
    >
      <g id="heaven-logo-group">
        {/* --- H --- */}
        <path
          d="M 12 16 H 25 V 32 H 43 V 16 H 56 V 56 H 43 V 42 H 25 V 56 H 12 Z"
          fill={textColor}
        />

        {/* --- E --- */}
        <path
          d="M 64 16 H 104 V 25 H 77 V 31 H 100 V 40 H 77 V 47 H 105 V 56 H 64 Z"
          fill={textColor}
        />

        {/* --- STYLIZED GOLDEN 'A' (FURNITURE MOTIF) --- */}
        <g id="stylized-a">
          {/* A Outer shape and transparent inner triangle */}
          <path
            d="M 149 14 L 176 56 H 162 L 154 42 H 144 L 136 56 H 122 L 149 14 Z M 149 23 L 142 34 H 156 Z"
            fillRule="evenodd"
            fill={accentColor}
          />
          {/* Overhanging Chair / Bench Crossbar */}
          <path
            d="M 115 34 H 183 C 184 34 185 35 185 36 V 41 C 185 42 184 43 183 43 H 115 C 114 43 113 42 113 41 V 36 C 113 35 114 34 115 34 Z"
            fill={accentColor}
          />
        </g>

        {/* --- V --- */}
        <path
          d="M 186 16 H 199 L 209 44 L 219 16 H 232 L 215 56 H 203 Z"
          fill={textColor}
        />

        {/* --- E --- */}
        <path
          d="M 239 16 H 279 V 25 H 252 V 31 H 275 V 40 H 252 V 47 H 280 V 56 H 239 Z"
          fill={textColor}
        />

        {/* --- N --- */}
        <path
          d="M 287 16 H 300 L 316 41 V 16 H 328 V 56 H 315 L 299 31 V 56 H 287 Z"
          fill={textColor}
        />

        {/* --- FURNITURE MART SUBTEXT (Enhanced Line-Height & Size) --- */}
        {showSubtext && (
          <text
            x="170"
            y="86"
            fill={subtextColor}
            fontSize="15.5"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="5.2"
            textAnchor="middle"
          >
            FURNITURE MART
          </text>
        )}
      </g>
    </svg>
  );
}
