import { Zap, TrendingUp, Shield, Heart } from "@deemlol/next-icons";
import { type ReactNode } from "react";
import Reveal from "../animations/Reveal";
import SlideIn from "../animations/SlideIn";
import CtaBanner from "../ui/CtaBanner";
import ValueCard from "../ui/ValueCard";
import { aboutStats, aboutValues, type AboutValueKey } from "@/src/lib/about";

const iconMap: Record<AboutValueKey, ReactNode> = {
  Zap: <Zap size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Shield: <Shield size={20} />,
  Heart: <Heart size={20} />,
};

export default function About() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        <div className="flex flex-col gap-10">
          <div className="max-w-xl">
            <Reveal delay={0.1}>
              <h2 className="text-sapin font-black mb-4">
                Chaque invendu mérite{" "}
                <span className="relative whitespace-nowrap">
                  <span
                    className="absolute inset-0 bg-lime rounded-lg -rotate-1 scale-x-110"
                    aria-hidden="true"
                  />
                  <span className="relative">une seconde vie</span>
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sapin leading-relaxed">
                Récoltéo connecte commerçants et associations pour transformer
                le gaspillage en solidarité pour une gestion simple, légale et
                durable des invendus.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="grid grid-cols-3 divide-x divide-sapin/10 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] overflow-hidden">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-6 py-7 text-center bg-lime/5"
                >
                  <p className="text-3xl sm:text-4xl font-black text-sapin leading-none">
                    {stat.value}
                  </p>
                  <p className="text-sapin/60 text-xs font-bold mt-1.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4">
          {aboutValues.map((value, i) => (
            <SlideIn
              key={value.title}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 0.15}
            >
              <ValueCard
                icon={iconMap[value.icon]}
                title={value.title}
                description={value.description}
              />
            </SlideIn>
          ))}
        </div>

        <Reveal delay={0.15}>
          <CtaBanner
            heading="Prêt à réduire votre gaspillage ?"
            subheading="Rejoignez les 150+ commerçants qui agissent déjà."
            buttonLabel="Accéder au dashboard"
            buttonHref="/dashboard"
          />
        </Reveal>
      </div>
    </section>
  );
}
