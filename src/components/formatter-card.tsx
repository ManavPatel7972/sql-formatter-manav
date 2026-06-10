import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "sql-formatter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Eraser,
  FileCode,
  Heart,
  History as HistoryIcon,
  Loader2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/code-editor";
import { getStats } from "@/lib/sql-stats";

type Dialect = "sql" | "mysql" | "postgresql" | "tsql" | "sqlite";

const DIALECTS: { value: Dialect; label: string }[] = [
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "tsql", label: "SQL Server" },
  { value: "sqlite", label: "SQLite" },
  { value: "sql", label: "Standard SQL" },
];

const SAMPLE = `select u.id,u.name,count(o.id) as orders_count from users u left join orders o on o.user_id=u.id where u.created_at > '2024-01-01' and u.status='active' group by u.id,u.name having count(o.id)>5 order by orders_count desc limit 20;`;

interface HistoryItem {
  id: string;
  query: string;
  dialect: Dialect;
  at: number;
  favorite?: boolean;
}

const HISTORY_KEY = "sqlfp-history";

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function FormatterCard() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState<{ ok: boolean; msg: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const stats = getStats(output || input);

  const persist = useCallback((items: HistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  }, []);

  const doFormat = useCallback(() => {
    if (!input.trim()) {
      toast.error("Nothing to format");
      return;
    }
    setLoading(true);
    setValidation(null);
    setTimeout(() => {
      try {
        const formatted = format(input, { language: dialect, keywordCase: "upper", tabWidth: 2 });
        setOutput(formatted);
        setValidation({ ok: true, msg: "Looks valid — no syntax issues detected." });
        const item: HistoryItem = {
          id: crypto.randomUUID(),
          query: input,
          dialect,
          at: Date.now(),
        };
        const next = [item, ...history.filter((h) => h.query !== input)].slice(0, 20);
        persist(next);
        toast.success("Formatted successfully");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setValidation({ ok: false, msg });
        toast.error("Format failed", { description: msg });
      } finally {
        setLoading(false);
      }
    }, 180);
  }, [input, dialect, history, persist]);

  const doMinify = useCallback(() => {
    if (!input.trim()) return toast.error("Nothing to minify");
    const minified = input.replace(/\s+/g, " ").replace(/\s*([,;()])\s*/g, "$1").trim();
    setOutput(minified);
    toast.success("Minified");
  }, [input]);

  const doValidate = useCallback(() => {
    if (!input.trim()) return toast.error("Nothing to validate");
    try {
      format(input, { language: dialect });
      setValidation({ ok: true, msg: "Looks valid — no syntax issues detected." });
      toast.success("SQL looks valid");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid SQL";
      setValidation({ ok: false, msg });
      toast.error("Invalid SQL", { description: msg });
    }
  }, [input, dialect]);

  const doCopy = useCallback(async () => {
    const text = output || input;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }, [output, input]);

  const doClear = useCallback(() => {
    setInput("");
    setOutput("");
    setValidation(null);
  }, []);

  const doDownload = useCallback(() => {
    const text = output || input;
    if (!text) return toast.error("Nothing to download");
    const blob = new Blob([text], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, input]);

  const doUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result || ""));
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        doFormat();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        doCopy();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [doFormat, doCopy]);

  const toggleFav = (id: string) => {
    persist(history.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h)));
  };
  const removeItem = (id: string) => persist(history.filter((h) => h.id !== id));
  const loadItem = (h: HistoryItem) => {
    setInput(h.query);
    setDialect(h.dialect);
    toast("Loaded from history");
  };

  const favorites = history.filter((h) => h.favorite);

  return (
    <section id="formatter" className="relative px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass overflow-hidden rounded-3xl p-4 shadow-2xl shadow-primary/5 sm:p-6"
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Select value={dialect} onValueChange={(v) => setDialect(v as Dialect)}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIALECTS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={doFormat} disabled={loading} className="brand-gradient-bg text-white shadow-md shadow-primary/20 hover:opacity-90">
                {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Wand2 className="mr-1.5 h-4 w-4" />}
                Format
                <kbd className="ml-2 hidden rounded bg-white/15 px-1.5 py-0.5 text-[10px] sm:inline">⌘↵</kbd>
              </Button>

              <Button variant="outline" onClick={doMinify}>
                <Minimize2 className="mr-1.5 h-4 w-4" />
                Minify
              </Button>
              <Button variant="outline" onClick={doValidate}>
                <ShieldCheck className="mr-1.5 h-4 w-4" />
                Validate
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".sql,text/plain"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && doUpload(e.target.files[0])}
              />
              <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1.5 h-4 w-4" />
                Upload
              </Button>
              <Button variant="ghost" size="sm" onClick={doDownload}>
                <Download className="mr-1.5 h-4 w-4" />
                .sql
              </Button>
              <Button variant="ghost" size="sm" onClick={doCopy}>
                {copied ? <Check className="mr-1.5 h-4 w-4 text-emerald-500" /> : <Copy className="mr-1.5 h-4 w-4" />}
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={doClear}>
                <Eraser className="mr-1.5 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Editors */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label icon={<FileCode className="h-3.5 w-3.5" />} text="Input" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Paste SQL</span>
              </div>
              <CodeEditor value={input} onChange={setInput} placeholder="Paste your SQL here..." />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label icon={<Sparkles className="h-3.5 w-3.5" />} text="Output" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Read-only</span>
              </div>
              <CodeEditor value={output} readOnly placeholder="Formatted SQL will appear here..." />
            </div>
          </div>

          {/* Validation banner */}
          <AnimatePresence>
            {validation && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                  validation.ok
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="font-mono text-xs leading-relaxed">{validation.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Characters" value={stats.chars} />
            <Stat label="Words" value={stats.words} />
            <Stat label="Lines" value={stats.lines} />
            <Stat label="Queries" value={stats.queries} />
          </div>
        </motion.div>

        {/* History / Favorites */}
        <div id="history" className="mt-8">
          <Tabs defaultValue="history">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Your queries</h3>
              <TabsList>
                <TabsTrigger value="history" className="gap-1.5">
                  <HistoryIcon className="h-3.5 w-3.5" />
                  Recent
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{history.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  Favorites
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{favorites.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="history" className="mt-4">
              <QueryList items={history} onLoad={loadItem} onFav={toggleFav} onRemove={removeItem} empty="No history yet — format a query to get started." />
            </TabsContent>
            <TabsContent value="favorites" className="mt-4">
              <QueryList items={favorites} onLoad={loadItem} onFav={toggleFav} onRemove={removeItem} empty="Star a query from your history to pin it here." />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function Label({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      {icon}
      {text}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-xl font-semibold tabular-nums">{value.toLocaleString()}</div>
    </div>
  );
}

function QueryList({
  items,
  onLoad,
  onFav,
  onRemove,
  empty,
}: {
  items: HistoryItem[];
  onLoad: (h: HistoryItem) => void;
  onFav: (id: string) => void;
  onRemove: (id: string) => void;
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">{empty}</div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((h) => (
        <motion.div
          key={h.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass group rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-[10px] uppercase">{h.dialect}</Badge>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => onFav(h.id)} className="rounded-md p-1 hover:bg-accent" aria-label="Favorite">
                <Heart className={`h-3.5 w-3.5 ${h.favorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
              </button>
              <button onClick={() => onRemove(h.id)} className="rounded-md p-1 hover:bg-accent" aria-label="Remove">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <button onClick={() => onLoad(h)} className="mt-2 block w-full text-left">
            <pre className="line-clamp-3 whitespace-pre-wrap break-words font-mono text-xs text-foreground/80">
              {h.query}
            </pre>
          </button>
          <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            {new Date(h.at).toLocaleString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
