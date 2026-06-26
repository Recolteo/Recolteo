"use client";

import { motion } from "motion/react";

interface FadeOutProps {
  children: React.ReactNode;
  className?: string;
}

export default function FadeOut({ children, className }: FadeOutProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
