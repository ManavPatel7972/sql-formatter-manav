import { motion } from "framer-motion";
import { ArrowDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-12 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.25 264), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -top-20 right-1/4 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.22 320), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
        >
          <Zap className="h-3 w-3 text-yellow-400" />
          <span className="text-muted-foreground">Format · Minify · Validate in one place</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Beautiful SQL,{" "}
          <span className="brand-gradient-text">in milliseconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          A premium-grade formatter for MySQL, PostgreSQL, SQL Server and SQLite.
          Paste your messy query and ship clean, readable SQL — every time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="brand-gradient-bg text-white shadow-xl shadow-primary/20 hover:opacity-90">
            <a href="#formatter">
              Open Formatter
              <ArrowDown className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">See features</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
