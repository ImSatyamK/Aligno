import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Social media that
          <span className="text-[#C08A2E]"> moves you forward</span>
        </h2>

        <p className="mt-6 text-muted-foreground max-w-xl">
          Aligno helps you track goals, Learn and practice, and stay accountable —
          without distractions. No noise. Just momentum.
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground text-background py-16 text-center">
        <h3 className="text-2xl font-semibold">
          Start building consistency today
        </h3>

        <p className="mt-3 text-background/70">
          Join Aligno and turn your goals into visible progress.
        </p>

        <Link href={'/signup'}>
          <button className="mt-6 bg-[#C08A2E] px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition text-white">
            Create Account
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Aligno. Built for focus.
      </footer>
    </main>
  );
}