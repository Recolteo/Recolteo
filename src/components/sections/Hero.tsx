export default function Hero() {
  return (
    <section className="bg-sapin px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28 rounded-b-3xl">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-cream font-black mb-6">
          Votre réseau
          <br />
          qui échange{" "}
          <span className="relative italic whitespace-nowrap">
            <span
              className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
              aria-hidden="true"
            />
            <span className="relative text-sapin">vraiment</span>
          </span>
          <br />
          <span className="italic text-peach">proche</span> de chez vous
        </h1>

        <p className="text-cream max-w-xl mx-auto mb-10">
          Recolteo connecte commerçants et associations pour une solidarité de
          proximité, simple et gratuite. Une action où tout le monde y gagne.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button>Explorer la plateforme →</button>
          <button>Voir une démo en 90s</button>
        </div>
      </div>
    </section>
  );
}
