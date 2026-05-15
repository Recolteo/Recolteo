"use client";

import { motion } from "motion/react";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  delay?: number;
}

export default function SlideIn({
  children,
  direction = "left",
  delay = 0,
}: SlideInProps) {
  return (
    <div style={{ overflowX: "clip", paddingTop: "0.5rem", marginTop: "-0.5rem", paddingRight: "6px", marginRight: "-6px", paddingBottom: "6px", marginBottom: "-6px" }}>
      <motion.div
        initial={{ opacity: 0, x: direction === "left" ? -72 : 72, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          delay,
          type: "spring",
          stiffness: 280,
          damping: 16,
          mass: 1.0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
