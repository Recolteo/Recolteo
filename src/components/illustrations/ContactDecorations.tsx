"use client";

import { motion } from "motion/react";
import { LeafEmpty, LeafFull, Star, CircleDecor, Fleche } from "./assetsIllustrations";

const SPRING = { type: "spring", stiffness: 200, damping: 26 } as const;
const SPRING_STAR = { type: "spring", stiffness: 260, damping: 18 } as const;

export default function ContactDecorations() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-8 right-4 sm:top-12 sm:right-[5%] lg:right-[7%] w-6 sm:w-8"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.7, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.1 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-10 left-[3%] lg:left-[6%] w-12 sm:w-14 opacity-30"
        initial={{ opacity: 0, x: -40, rotate: -30 }}
        whileInView={{ opacity: 0.3, x: 0, rotate: -15 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.15 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[30%] -right-4 w-16 opacity-25"
        initial={{ opacity: 0, x: 50, rotate: 40 }}
        whileInView={{ opacity: 0.25, x: 0, rotate: 22 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.2 }}
      >
        <LeafFull />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[55%] left-[2%] w-5 opacity-40"
        initial={{ opacity: 0, scale: 0, x: -20 }}
        whileInView={{ opacity: 0.4, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_STAR, delay: 0.25 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-[5%] sm:right-[8%] w-5 sm:w-6 opacity-40"
        initial={{ opacity: 0, y: 40, scale: 0 }}
        whileInView={{ opacity: 0.4, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.2 }}
      >
        <Star color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute bottom-6 left-[8%] w-12 opacity-20"
        initial={{ opacity: 0, x: -30, rotate: -20 }}
        whileInView={{ opacity: 0.2, x: 0, rotate: -8, scale: 1.25 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: 0.35 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>

      <motion.div
        className="absolute -top-10 -right-10 w-48 sm:w-64 lg:w-80 opacity-[0.1]"
        initial={{ opacity: 0, x: 60, scale: 0.5 }}
        whileInView={{ opacity: 0.05, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        <CircleDecor color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[18%] right-[12%] w-5 opacity-50"
        initial={{ opacity: 0, y: -30, scale: 0 }}
        whileInView={{ opacity: 0.5,x: 80, y: 80, scale: 2.5 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_STAR, delay: 0.3 }}
      >
        <CircleDecor color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute bottom-[20%] right-[3%] w-14 opacity-20"
        initial={{ opacity: 0, x: 40, rotate: 30 }}
        whileInView={{ opacity: 0.2, x: 0, y: -20, rotate: 0, scale: 1.25 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING, delay: 0.4 }}
      >
        <Fleche color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[62%] left-[4%] w-10 opacity-30"
        initial={{ opacity: 0, y: 30, rotate: -40 }}
        whileInView={{ opacity: 0.3, y: 0, rotate: -20 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING, delay: 0.45 }}
      >
        <LeafFull />
      </motion.div>
    </div>
  );
}
