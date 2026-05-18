import { HTMLAttributes } from 'react';

interface VetlyLogoProps extends HTMLAttributes<HTMLDivElement> {}

export function VetlyLogo({ className = '', ...props }: VetlyLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} {...props}>
      <span className="inline-flex items-center justify-center rounded-xl bg-[#22c55e] p-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 5v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V5l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">Vetly</span>
    </div>
  );
}
