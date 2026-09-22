interface LogoProps {
  className?: string;
  /** When false, only the badge mark is rendered (no wordmark). */
  withText?: boolean;
  /** Use light colours for placement on dark backgrounds (e.g. the footer). */
  variant?: 'dark' | 'light';
}

/**
 * Original, custom-drawn dog-head badge + wordmark. Inline SVG so it stays
 * crisp at any size and can recolour for light/dark backgrounds.
 */
export default function Logo({ className, withText = true, variant = 'dark' }: LogoProps) {
  const titleColor = variant === 'light' ? '#ffffff' : '#0f1011';
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="logo-badge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#404349" />
            <stop offset="1" stopColor="#0f1011" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logo-badge)" />
        <g fill="#e9e2d6">
          <polygon points="14,30 24,4 29,28" />
          <polygon points="50,30 40,4 35,28" />
          <path d="M32 19c-8 0-13 6-13 14 0 9 6 16 13 16s13-7 13-16c0-8-5-14-13-14z" />
        </g>
        <g fill="#0d0e0f">
          <ellipse cx="27" cy="37" rx="2.3" ry="3" />
          <ellipse cx="37" cy="37" rx="2.3" ry="3" />
        </g>
        <path d="M32 42l-2.3 2.1h4.6z" fill="#8a3a15" />
        <path
          d="M32 45c-1.8 1.8-3.8 1.4-4.6 0M32 45c1.8 1.8 3.8 1.4 4.6 0"
          fill="none"
          stroke="#0d0e0f"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-lg font-extrabold tracking-tight" style={{ color: titleColor }}>
            CROWN LEGACY
          </span>
          <span className="font-heading text-xs font-semibold tracking-[0.25em] text-ember">DOBERMANS</span>
        </span>
      )}
    </span>
  );
}
