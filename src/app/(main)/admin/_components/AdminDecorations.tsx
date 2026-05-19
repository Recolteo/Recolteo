"use client";

import { motion } from "motion/react";
import {
  LeafFull,
  LeafEmpty,
  CircleDecor,
  Star,
} from "@/src/components/illustrations/assetsIllustrations";

const SPRING = { type: "spring", stiffness: 200, damping: 26 } as const;

export default function AdminDecorations() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-6 -left-2 sm:top-10 sm:left-[1%] lg:left-[5%] w-12 sm:w-16 lg:w-20 opacity-30"
        initial={{ opacity: 0, x: -60, rotate: -30 }}
        whileInView={{ opacity: 0.3, x: 0, rotate: -15 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        <LeafFull />
      </motion.div>

      <motion.div
        className="absolute top-8 right-4 sm:top-12 sm:right-[5%] lg:right-[8%] w-5 sm:w-6 opacity-60"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.6, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.15 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="absolute -bottom-20 -right-16 w-56 sm:w-72 lg:w-80 opacity-[0.05]"
        initial={{ opacity: 0, scale: 0.6, x: 50 }}
        whileInView={{ opacity: 0.05, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING, delay: 0.2 }}
      >
        <CircleDecor color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-10 left-[3%] sm:left-[5%] w-12 sm:w-16 opacity-20"
        initial={{ opacity: 0, x: -40, rotate: -40 }}
        whileInView={{ opacity: 0.2, x: 0, rotate: -20 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.25 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-12 right-[6%] w-4 sm:w-5 opacity-40"
        initial={{ opacity: 0, y: 30, scale: 0 }}
        whileInView={{ opacity: 0.4, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.3 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[40%] -right-4 w-14 opacity-15"
        initial={{ opacity: 0, x: 50, rotate: 40 }}
        whileInView={{ opacity: 0.15, x: 0, rotate: 22 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.2 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[55%] left-[3%] w-4 opacity-35"
        initial={{ opacity: 0, scale: 0, x: -20 }}
        whileInView={{ opacity: 0.35, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING, delay: 0.35 }}
      >
        <Star color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute -top-10 left-[15%] w-32 opacity-[0.06]"
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        whileInView={{ opacity: 0.06, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        <CircleDecor color="#c9f242" />
      </motion.div>
    </div>
  );
}
