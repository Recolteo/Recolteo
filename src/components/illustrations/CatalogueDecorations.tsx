"use client";

import { motion } from "motion/react";
import { LeafEmpty, Star, CircleDecor } from "./assetsIllustrations";

const SPRING_SECTION = { type: "spring", stiffness: 200, damping: 26 } as const;
const SPRING_STAR = { type: "spring", stiffness: 260, damping: 18 } as const;
const SPRING_CIRCLE = { type: "spring", stiffness: 260, damping: 18 } as const;

export default function CatalogueDecorations() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-10 left-3 sm:top-14 sm:left-6 w-5 sm:w-6 opacity-55"
        initial={{ opacity: 0, y: -30, scale: 0 }}
        whileInView={{ opacity: 0.55, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.1 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-8 right-[3%] sm:top-12 w-8 sm:w-10 opacity-40"
        initial={{ opacity: 0, x: 40, rotate: 30 }}
        whileInView={{ opacity: 0.4, x: 0, rotate: 18 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.15 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[22%] -left-5 w-14 opacity-[0.12]"
        initial={{ opacity: 0, x: -50, scale: 0.6 }}
        whileInView={{ opacity: 0.12, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_CIRCLE, delay: 0.2 }}
      >
        <CircleDecor color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[45%] right-[1%] w-5 opacity-45"
        initial={{ opacity: 0, scale: 0, x: 20 }}
        whileInView={{ opacity: 0.45, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_STAR, delay: 0.25 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="absolute -bottom-14 -right-10 w-52 sm:w-64 lg:w-80 opacity-[0.06]"
        initial={{ opacity: 0, x: 60, scale: 0.5 }}
        whileInView={{ opacity: 0.06, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING_CIRCLE, delay: 0.3 }}
      >
        <CircleDecor color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-12 left-[3%] sm:left-[5%] w-5 sm:w-6 opacity-35"
        initial={{ opacity: 0, y: 40, scale: 0 }}
        whileInView={{ opacity: 0.35, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.2 }}
      >
        <Star color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute bottom-8 right-[5%] w-12 opacity-15"
        initial={{ opacity: 0, x: -30, rotate: -35 }}
        whileInView={{ opacity: 0.15, x: 0, rotate: -18 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.35 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>
    </div>
  );
}
