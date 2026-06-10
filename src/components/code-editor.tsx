import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function CodeEditor({ value, onChange, readOnly, placeholder, onKeyDown, className }: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = value ? value.split("\n").length : 1;

  // Auto-resize textarea
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 360) + "px";
  }, [value]);

  // Sync gutter scroll
  const handleScroll = () => {
    if (gutterRef.current && ref.current) {
      gutterRef.current.scrollTop = ref.current.scrollTop;
    }
  };

  return (
    <div className={cn("relative flex min-h-[360px] overflow-hidden rounded-xl border border-border bg-card/40 font-mono text-sm", className)}>
      <div
        ref={gutterRef}
        className="select-none overflow-hidden border-r border-border/60 bg-muted/30 px-3 py-4 text-right text-xs leading-6 text-muted-foreground"
        aria-hidden
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        readOnly={readOnly}
        spellCheck={false}
        placeholder={placeholder}
        onScroll={handleScroll}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        className="min-h-[360px] flex-1 resize-none bg-transparent px-4 py-4 leading-6 text-foreground caret-primary outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
