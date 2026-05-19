"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "@deemlol/next-icons";
import Reveal from "../animations/Reveal";
import SlideIn from "../animations/SlideIn";
import TabToggle from "../ui/TabToggle";
import VideoPlayer from "../ui/VideoPlayer";
import { demos, tabs, type UserType } from "@/src/lib/data/videoDemo";
import { VideoDemoDecorations } from "../illustrations/assetsIllustrations";

export default function VideoDemo() {
  const [active, setActive] = useState<UserType>("commercant");
  const demo = demos[active];

  return (
    <section
      id="videodemo"
      className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden"
    >
      <VideoDemoDecorations />
      <div className="relative max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal delay={0.1}>
              <h2 className="text-sapin font-black mb-4">
                Voyez Récoltéo
                <br />
                <span className="italic text-peach">en action</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sapin leading-relaxed">
                Commerçant ou association, découvrez comment la plateforme
                s'intègre à votre quotidien.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <TabToggle
              tabs={tabs}
              active={active}
              onChange={(v) => setActive(v as UserType)}
            />
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-center">
          <SlideIn direction="left">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-sapin font-black mb-2 whitespace-pre-line">
                    {demo.title}
                  </h3>
                  <p className="text-sapin leading-relaxed">{demo.subtitle}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {demo.points.map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <span className="w-6 h-6 shrink-0 bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] rounded-full flex items-center justify-center text-sapin">
                        <Check size={16} />
                      </span>
                      <span className="text-sapin font-bold">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </SlideIn>

          <SlideIn direction="right" delay={0.15}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="max-w-xl ml-auto"
              >
                <VideoPlayer src={demo.src} />
              </motion.div>
            </AnimatePresence>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
