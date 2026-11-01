import { CopyButton } from "./index";
import { cn } from "@/lib/utils";

export function CodeBlock({ code, className, title }: { code: string; className?: string; title?: string }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-md border bg-muted/50", className)}>
      {title && <div className="border-b px-3 py-1.5 font-mono text-[11px] text-muted-foreground">{title}</div>}
      <CopyButton value={code} className="absolute right-1.5 top-1.5 bg-card opacity-0 shadow-sm transition-opacity group-hover:opacity-100" />
      <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}
