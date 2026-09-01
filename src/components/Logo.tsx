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
  const titleColor = variant === 'light' ? '#ffffff' : '#213e53';
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="logo-badge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4d7c99" />
            <stop offset="1" stopColor="#213e53" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logo-badge)" />
        <g fill="#f4efe6">
          <ellipse cx="17" cy="24" rx="6" ry="8" transform="rotate(-20 17 24)" />
          <ellipse cx="47" cy="24" rx="6" ry="8" transform="rotate(20 47 24)" />
          <path d="M32 20c-9 0-14 7-14 15 0 8 6 14 14 14s14-6 14-14c0-8-5-15-14-15z" />
        </g>
        <g fill="#213e53">
          <ellipse cx="26" cy="34" rx="2.6" ry="3.2" />
          <ellipse cx="38" cy="34" rx="2.6" ry="3.2" />
        </g>
        <path d="M32 39l-2.6 2.4h5.2z" fill="#b5502e" />
        <path
          d="M32 42c-2 2-4.2 1.6-5.2 0M32 42c2 2 4.2 1.6 5.2 0"
          fill="none"
          stroke="#213e53"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-lg font-extrabold tracking-tight" style={{ color: titleColor }}>
            IRONLINE
          </span>
          <span className="font-heading text-xs font-semibold tracking-[0.25em] text-ember">BULLIES</span>
        </span>
      )}
    </span>
  );
}
