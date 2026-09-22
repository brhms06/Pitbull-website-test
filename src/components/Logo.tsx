interface LogoProps {
  className?: string;
}

/** Official Crown Legacy Dobermans emblem — crest, puppies and wordmark are baked into the artwork. */
export default function Logo({ className }: LogoProps) {
  return <img src="/logo.png" alt="Crown Legacy Dobermans" className={`h-14 w-auto ${className ?? ''}`} />;
}
