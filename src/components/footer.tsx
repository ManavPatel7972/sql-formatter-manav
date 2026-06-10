import { Database } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="brand-gradient-bg flex h-6 w-6 items-center justify-center rounded-md">
            <Database className="h-3.5 w-3.5 text-white" />
          </div>
          <span>SQL Formatter Pro — crafted for developers.</span>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SQL Formatter Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
