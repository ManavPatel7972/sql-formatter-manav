import { motion } from "framer-motion";
import {
  Database,
  Gauge,
  History,
  Keyboard,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";

const features = [
  { icon: Wand2, title: "Instant formatting", desc: "Beautify any messy SQL in under a millisecond, locally in your browser." },
  { icon: Database, title: "Multi-dialect", desc: "MySQL, PostgreSQL, SQL Server, SQLite, BigQuery and more." },
  { icon: Gauge, title: "Minifier", desc: "Strip whitespace and compress queries for embedding or transport." },
  { icon: ShieldCheck, title: "Validator", desc: "Catch obvious syntax issues before they hit production." },
  { icon: History, title: "Query history", desc: "Every query you format is saved locally, ready to recall." },
  { icon: Star, title: "Favorites", desc: "Pin queries you use often for one-click access." },
  { icon: Keyboard, title: "Keyboard-first", desc: "⌘/Ctrl + Enter to format, ⌘/Ctrl + Shift + C to copy output." },
  { icon: Sparkles, title: "Zero tracking", desc: "Everything runs client-side. Your SQL never leaves your device." },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need, <span className="brand-gradient-text">nothing you don't</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for engineers who care about clean diffs and readable queries.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="brand-gradient-bg mb-4 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
