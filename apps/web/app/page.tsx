import Link from "next/link";

const languages = [
  { flag: "🇪🇸", name: "Spanish", learners: "500M+ speakers" },
  { flag: "🇨🇳", name: "Mandarin", learners: "900M+ speakers" },
  { flag: "🇫🇷", name: "French", learners: "300M+ speakers" },
  { flag: "🇯🇵", name: "Japanese", learners: "125M+ speakers" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <span className="text-2xl font-bold text-emerald-500">LingoLeap</span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Log in
          </Link>
          <Link href="/auth/signup" className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl">
          Learn a language for{" "}
          <span className="text-emerald-500">free</span>, one day at a time
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl">
          Build daily streaks, master vocabulary, and become fluent in Spanish, Mandarin, French, or Japanese.
        </p>
        <Link href="/auth/signup" className="px-8 py-4 rounded-xl bg-emerald-500 text-white text-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg">
          Start learning — it&apos;s free
        </Link>
      </section>

      {/* Languages */}
      <section className="flex flex-col items-center gap-8 px-6 py-16">
        <h2 className="text-3xl font-bold">Choose your language</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl">
          {languages.map((lang) => (
            <Link
              key={lang.name}
              href={`/auth/signup`}
              className="flex flex-col items-center gap-3 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <span className="text-6xl">{lang.flag}</span>
              <span className="text-xl font-semibold">{lang.name}</span>
              <span className="text-sm text-slate-500">{lang.learners}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col items-center gap-8 px-6 py-16 bg-white dark:bg-slate-800">
        <h2 className="text-3xl font-bold">Why LingoLeap?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl text-center">
          {[
            { icon: "🔥", title: "Daily Streaks", desc: "Stay motivated with a daily streak counter and reminders." },
            { icon: "🧠", title: "Smart Quizzes", desc: "Bite-sized multiple-choice quizzes to reinforce what you learn." },
            { icon: "📈", title: "Track Progress", desc: "See exactly how many lessons you have completed per language." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3 p-6">
              <span className="text-5xl">{f.icon}</span>
              <span className="text-lg font-semibold">{f.title}</span>
              <span className="text-slate-500 dark:text-slate-400">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-6 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to start?</h2>
        <p className="text-slate-500 dark:text-slate-400">No credit card. No subscription. Just learning.</p>
        <Link href="/auth/signup" className="px-8 py-4 rounded-xl bg-emerald-500 text-white text-lg font-bold hover:bg-emerald-600 transition-colors">
          Create free account
        </Link>
      </section>

      <footer className="text-center py-6 text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
        © {new Date().getFullYear()} LingoLeap — Free forever
      </footer>
    </main>
  );
}
