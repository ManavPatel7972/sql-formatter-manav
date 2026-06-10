import { motion } from "framer-motion";
import { Database, Github, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const { theme, toggle } = useTheme();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="brand-gradient-bg flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">SQL Formatter Pro</span>
            <span className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
              Beautify · Validate · Ship
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#formatter" className="transition-colors hover:text-foreground">Formatter</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#history" className="transition-colors hover:text-foreground">History</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button size="sm" className="brand-gradient-bg hidden text-white shadow-lg shadow-primary/20 hover:opacity-90 sm:inline-flex">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Pro
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
