"use client";

import { motion } from "motion/react";
import {
  LeafFull,
  LeafEmpty,
  CircleDecor,
  Star,
} from "@/src/components/illustrations/assetsIllustrations";

const SPRING = { type: "spring", stiffness: 200, damping: 26 } as const;

export default function ProfilDecorations() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-4 -right-4 sm:top-8 sm:right-[0%] lg:right-[4%] w-14 sm:w-20 lg:w-24 opacity-20"
        initial={{ opacity: 0, x: 60, rotate: 30 }}
        whileInView={{ opacity: 0.2, x: 0, rotate: 12 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        <LeafFull />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-32 right-[2%] lg:right-[8%] w-8 lg:w-10 opacity-15"
        initial={{ opacity: 0, x: 30, rotate: -20 }}
        whileInView={{ opacity: 0.15, x: 0, rotate: -5 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.18 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>

      <motion.div
        className="absolute top-6 left-3 sm:top-10 sm:left-[4%] lg:left-[7%] w-5 sm:w-6 opacity-70"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.7, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.15 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="hidden md:block absolute top-[45%] right-[2%] lg:right-[6%] w-4 lg:w-5 opacity-50"
        initial={{ opacity: 0, x: 30, scale: 0 }}
        whileInView={{ opacity: 0.5, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.22 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="absolute -bottom-24 -left-20 w-64 sm:w-80 lg:w-96 opacity-[0.06]"
        initial={{ opacity: 0, scale: 0.6, x: -50 }}
        whileInView={{ opacity: 0.06, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING, delay: 0.2 }}
      >
        <CircleDecor color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute -top-12 left-[40%] w-32 opacity-[0.04]"
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        whileInView={{ opacity: 0.04, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.25 }}
      >
        <CircleDecor color="#06573f" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-8 right-[2%] sm:right-[4%] w-14 sm:w-18 opacity-15"
        initial={{ opacity: 0, x: 40, rotate: 40 }}
        whileInView={{ opacity: 0.15, x: 0, rotate: 18 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.28 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-[5%] sm:left-[7%] w-4 sm:w-5 opacity-45"
        initial={{ opacity: 0, y: 30, scale: 0 }}
        whileInView={{ opacity: 0.45, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.32 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[38%] -left-5 w-16 opacity-12"
        initial={{ opacity: 0, x: -50, rotate: -40 }}
        whileInView={{ opacity: 0.12, x: 0, rotate: -22 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.2 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>
    </div>
  );
}
