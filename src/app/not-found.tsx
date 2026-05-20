import Btn from "../components/ui/primitives/Button";
import Reveal from "../components/animations/Reveal";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
      <Reveal delay={0}>
        <h1 className="text-sapin font-black leading-none tracking-tighter">
          404
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <h2 className="text-sapin">Vous êtes perdus ?</h2>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="text-sapin/50 max-w-xs">
          Cette page n'existe pas. On ne sait pas non plus comment vous avez
          atterri ici.
        </p>
      </Reveal>

      <Reveal delay={0.45}>
        <p className="text-peach/70 italic font-bold">
          "Ce n'est pas votre faute... enfin, peut-être un peu."
        </p>
      </Reveal>

      <Reveal delay={0.6}>
        <div className="mt-2">
          <Btn
            label="Retour à l'accueil"
            href="/"
            variant="sapin"
            size="md"
            showArrow={true}
          />
        </div>
      </Reveal>
    </div>
  );
}
