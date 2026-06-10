import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FormatterCard } from "@/components/formatter-card";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQL Formatter Pro — Beautify SQL Instantly" },
      {
        name: "description",
        content:
          "A premium SQL formatter, minifier and validator for MySQL, PostgreSQL, SQL Server and SQLite. Clean queries in milliseconds.",
      },
      { property: "og:title", content: "SQL Formatter Pro" },
      {
        property: "og:description",
        content: "Beautify, minify and validate SQL in milliseconds — for MySQL, PostgreSQL, SQL Server and SQLite.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FormatterCard />
        <Features />
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
