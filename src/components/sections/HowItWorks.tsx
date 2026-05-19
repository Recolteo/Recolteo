import Reveal from "../animations/Reveal";
import ProfileCard from "../ui/ProfileCard";
import { profiles } from "../../lib/data/how-it-works";
import { HowItWorksDecorations } from "../illustrations/assetsIllustrations";

export default function HowItWorks() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">
      <HowItWorksDecorations />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-12">
          <Reveal delay={0.15}>
            <h2 className="text-sapin font-black mb-4">
              Comment ça
              <br />
              <span className="italic text-peach">marche</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-sapin max-w-md leading-relaxed">
              Deux acteurs, une plateforme. Chaque don devient une ressource
              utile, chaque échange génère son reçu fiscal automatiquement.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {profiles.map((profile, i) => (
            <Reveal key={profile.role} delay={0.15 + i * 0.15}>
              <ProfileCard {...profile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
