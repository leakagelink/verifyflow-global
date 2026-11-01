export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M5 18V6l14 12V6" />
        </svg>
      </span>
      {!compact && <span className="text-[15px] font-semibold tracking-tight group-data-[collapsible=icon]:hidden">Numora</span>}
    </span>
  );
}
