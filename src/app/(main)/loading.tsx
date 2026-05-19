const letters = "Récoltéo".split("");

export default function Loading() {
  return (
    <section>
      <div className="fixed top-0 left-0 right-0 h-0.75 bg-sapin/10 z-50 overflow-hidden">
        <div className="h-full w-1/4 bg-lime rounded-full animate-loading-bar" />
      </div>

      <div className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center gap-5 px-4">
        <div
          className="flex items-end gap-0.5"
          aria-label="Récoltéo"
          role="status"
        >
          {letters.map((letter, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="font-black text-5xl sm:text-7xl text-sapin inline-block leading-none select-none animate-letter-wave"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        <p className="text-sapin/40 text-xs font-semibold tracking-[0.25em] uppercase animate-in delay-2">
          Chargement en cours
        </p>
      </div>
    </section>
  );
}
