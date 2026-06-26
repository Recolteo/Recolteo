"use client";

import { motion } from "motion/react";

export function LeafFull({ className }: { className?: string }) {
  return (
    <svg width="73" height="70" viewBox="0 0 73 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M49.5 1.81243C31.557 6.29843 15.967 19.2774 7.841 36.4944C4.816 42.9034 0 60.3154 0 64.8434C0 68.9394 1.74 69.9154 9.04 69.9154C36.885 69.9154 63.424 49.2004 70.537 21.9154C72.211 15.4924 72.806 3.02943 71.537 0.975425C70.53 -0.653575 57.362 -0.152575 49.5 1.81243ZM68.983 7.16543C68.926 21.0844 61.833 37.7114 51.547 48.0394C42.288 57.3364 31.995 62.6024 17.629 65.3944L10.759 66.7294L15.548 61.8674C18.181 59.1934 20.733 57.2504 21.218 57.5504C21.703 57.8504 24.308 56.0294 27.007 53.5054C29.706 50.9804 32.52 48.9154 33.261 48.9154C34.002 48.9154 36.158 47.3064 38.054 45.3394C39.949 43.3724 43.638 40.3714 46.25 38.6704C48.862 36.9704 51 35.2044 51 34.7474C51 32.7854 47.292 34.2134 42.126 38.1654C39.07 40.5034 35.654 43.0394 34.535 43.8024C33.416 44.5664 40.271 37.3524 49.77 27.7724C63.523 13.9014 66.787 10.1024 65.798 9.11343C64.809 8.12443 58.798 13.6274 36.278 36.1374C20.725 51.6834 8 64.9674 8 65.6584C8 66.9044 4.846 67.4284 3.778 66.3594C3.017 65.5994 6.337 50.7474 8.891 43.4834C17.105 20.1204 40.092 3.61143 65.25 3.00543L69 2.91543L68.983 7.16543Z" fill="#06573F" />
      <path d="M68.983 7.16543C68.926 21.0844 61.833 37.7114 51.547 48.0394C42.288 57.3364 31.995 62.6024 17.629 65.3944L10.759 66.7294L15.548 61.8674C18.181 59.1934 20.733 57.2504 21.218 57.5504C21.703 57.8504 24.308 56.0294 27.007 53.5054C29.706 50.9804 32.52 48.9154 33.261 48.9154C34.002 48.9154 36.158 47.3064 38.054 45.3394C39.949 43.3724 43.638 40.3714 46.25 38.6704C48.862 36.9704 51 35.2044 51 34.7474C51 32.7854 47.292 34.2134 42.126 38.1654C39.07 40.5034 35.654 43.0394 34.535 43.8024C33.416 44.5664 40.271 37.3524 49.77 27.7724C63.523 13.9014 66.787 10.1024 65.798 9.11343C64.809 8.12443 58.798 13.6274 36.278 36.1374C20.725 51.6834 8 64.9674 8 65.6584C8 66.9044 4.846 67.4284 3.778 66.3594C3.017 65.5994 6.337 50.7474 8.891 43.4834C17.105 20.1204 40.092 3.61143 65.25 3.00543L69 2.91543L68.983 7.16543Z" fill="#C9F242" />
    </svg>
  );
}

export function LeafEmpty({ color = "#f16012", className }: { color?: string; className?: string }) {
  return (
    <svg width="73" height="70" viewBox="0 0 73 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M49.5 1.81243C31.557 6.29843 15.967 19.2774 7.841 36.4944C4.816 42.9034 0 60.3154 0 64.8434C0 68.9394 1.74 69.9154 9.04 69.9154C36.885 69.9154 63.424 49.2004 70.537 21.9154C72.211 15.4924 72.806 3.02943 71.537 0.975425C70.53 -0.653575 57.362 -0.152575 49.5 1.81243ZM68.983 7.16543C68.926 21.0844 61.833 37.7114 51.547 48.0394C42.288 57.3364 31.995 62.6024 17.629 65.3944L10.759 66.7294L15.548 61.8674C18.181 59.1934 20.733 57.2504 21.218 57.5504C21.703 57.8504 24.308 56.0294 27.007 53.5054C29.706 50.9804 32.52 48.9154 33.261 48.9154C34.002 48.9154 36.158 47.3064 38.054 45.3394C39.949 43.3724 43.638 40.3714 46.25 38.6704C48.862 36.9704 51 35.2044 51 34.7474C51 32.7854 47.292 34.2134 42.126 38.1654C39.07 40.5034 35.654 43.0394 34.535 43.8024C33.416 44.5664 40.271 37.3524 49.77 27.7724C63.523 13.9014 66.787 10.1024 65.798 9.11343C64.809 8.12443 58.798 13.6274 36.278 36.1374C20.725 51.6834 8 64.9674 8 65.6584C8 66.9044 4.846 67.4284 3.778 66.3594C3.017 65.5994 6.337 50.7474 8.891 43.4834C17.105 20.1204 40.092 3.61143 65.25 3.00543L69 2.91543L68.983 7.16543Z" fill={color} />
      <path d="M68.983 7.16543C68.926 21.0844 61.833 37.7114 51.547 48.0394C42.288 57.3364 31.995 62.6024 17.629 65.3944L10.759 66.7294L15.548 61.8674C18.181 59.1934 20.733 57.2504 21.218 57.5504C21.703 57.8504 24.308 56.0294 27.007 53.5054C29.706 50.9804 32.52 48.9154 33.261 48.9154C34.002 48.9154 36.158 47.3064 38.054 45.3394C39.949 43.3724 43.638 40.3714 46.25 38.6704C48.862 36.9704 51 35.2044 51 34.7474C51 32.7854 47.292 34.2134 42.126 38.1654C39.07 40.5034 35.654 43.0394 34.535 43.8024C33.416 44.5664 40.271 37.3524 49.77 27.7724C63.523 13.9014 66.787 10.1024 65.798 9.11343C64.809 8.12443 58.798 13.6274 36.278 36.1374C20.725 51.6834 8 64.9674 8 65.6584C8 66.9044 4.846 67.4284 3.778 66.3594C3.017 65.5994 6.337 50.7474 8.891 43.4834C17.105 20.1204 40.092 3.61143 65.25 3.00543L69 2.91543L68.983 7.16543Z" fill={color} />
    </svg>
  );
}

export function CircleDecor({ color = "#06573F", className }: { color?: string; className?: string }) {
  return (
    <svg width="102" height="97" viewBox="0 0 102 97" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M48.9554 0.721575C48.7494 1.30958 47.0054 2.05457 45.0804 2.37557C31.8284 4.58557 21.1104 9.93758 13.5184 18.1376C7.15936 25.0066 5.11436 28.6816 2.06236 38.7306C-1.28064 49.7366 -0.53464 61.2766 4.11936 70.5556C6.07436 74.4526 9.92536 79.7926 13.0654 82.9616C26.8854 96.9046 49.0174 100.296 67.9344 91.3676C71.9784 89.4596 75.8744 87.8976 76.5904 87.8976C78.9164 87.8976 90.7084 74.1356 94.3454 67.1756C99.0004 58.2686 101.08 50.9256 101.08 43.3976C101.08 29.8236 94.2404 17.5786 82.0804 9.38658C77.9554 6.60758 72.1054 3.51157 69.0804 2.50757C62.4544 0.308575 49.5014 -0.841425 48.9554 0.721575ZM64.6464 5.99058C77.1714 8.29858 86.2174 14.8936 91.7004 25.7136C94.3774 30.9966 94.5804 32.2086 94.5804 42.8976C94.5804 52.4986 94.2004 55.3886 92.2774 60.3976C87.3934 73.1196 78.2164 82.8506 65.0804 89.2376C58.8694 92.2566 58.0464 92.3956 46.5804 92.3616C36.6994 92.3316 33.6444 91.9476 29.2774 90.1876C15.1234 84.4816 4.46736 70.3816 3.34836 55.8816C2.41136 43.7436 8.33336 27.5496 16.8064 19.0766C27.8134 8.06958 47.1794 2.77258 64.6464 5.99058Z" fill={color} />
    </svg>
  );
}

export function Star({ color = "#f16012", className }: { color?: string; className?: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M21.988 9.086C21.271 14.083 20.12 18.737 19.429 19.429C18.737 20.12 14.083 21.271 9.086 21.988C4.089 22.704 0 23.61 0 24C0 24.39 4.089 25.296 9.086 26.012C14.083 26.729 18.737 27.88 19.429 28.571C20.12 29.263 21.27 33.904 21.984 38.886C22.698 43.868 23.601 47.747 23.991 47.505C24.381 47.264 25.286 42.981 26.002 37.988C26.909 31.656 27.787 28.656 28.902 28.076C29.781 27.619 34.438 26.667 39.25 25.961C44.063 25.255 48 24.366 48 23.984C48 23.602 43.911 22.704 38.914 21.988C33.917 21.271 29.263 20.12 28.571 19.429C27.88 18.737 26.729 14.083 26.012 9.086C25.296 4.089 24.39 0 24 0C23.61 0 22.704 4.089 21.988 9.086Z" fill={color} />
    </svg>
  );
}

export function Fleche({ color = "#f16012", className }: { color?: string; className?: string }) {
  return (
    <svg width="43" height="109" viewBox="0 0 43 109" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13.5 2.00049C13.5 2.00049 19.7715 5.53392 34.5 33.0005C47.2678 56.8106 38.0018 72.7873 28.9095 83.5005C19.8171 94.2136 16.2815 97.3599 8.99997 106.5M30 104.5C30 104.5 28 104 8.99997 106.5C3.49999 90.0005 1.99999 90.0005 1.99999 90.0005" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

const SPRING_SECTION = { type: "spring", stiffness: 200, damping: 26 } as const;
const SPRING_STAR = { type: "spring", stiffness: 260, damping: 18 } as const;
const SPRING_LEAF = { type: "spring", stiffness: 220, damping: 20 } as const;
const SPRING_CIRCLE = { type: "spring", stiffness: 260, damping: 18 } as const;

export function HeroDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-4 -left-3 sm:top-8 sm:left-[1%] lg:top-10 lg:left-[10%] w-14 sm:w-20 lg:w-24"
        initial={{ opacity: 0, y: -200, x: -100, scale: 0.2 }}
        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
        transition={{
          ...SPRING_LEAF,
          delay: 0,
          opacity: { duration: 0.15, delay: 0 },
        }}
      >
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ y: [0, -22, -8, 4, 0], rotate: [-15, -27, -6, -22, -15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        >
          <LeafFull />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-6 right-3 sm:top-10 sm:right-[3%] lg:top-14 lg:right-[6%] w-7 sm:w-9 lg:w-11"
        initial={{ opacity: 0, y: -180, scale: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          ...SPRING_STAR,
          delay: 0.12,
          opacity: { duration: 0.15, delay: 0.12 },
        }}
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
        >
          <Star color="#f16012" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-[38%] right-[0%] lg:right-[2%] w-14 lg:w-18"
        initial={{ opacity: 0, x: 200, scale: 0.3 }}
        animate={{ opacity: 0.9, x: 0, scale: 1 }}
        transition={{
          ...SPRING_LEAF,
          delay: 0.24,
          opacity: { duration: 0.15, delay: 0.24 },
        }}
      >
        <motion.div
          initial={{ rotate: 15 }}
          animate={{ y: [0, -18, -6, 3, 0], rotate: [15, 27, 6, 20, 15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <LeafEmpty color="#c9f242" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-[44%] -left-5 sm:left-[-1%] lg:left-[1%] w-14 lg:w-16"
        initial={{ opacity: 0, x: -180, scale: 0.2 }}
        animate={{ opacity: 0.5, x: 0, scale: 1 }}
        transition={{
          ...SPRING_CIRCLE,
          delay: 0.36,
          opacity: { duration: 0.15, delay: 0.36 },
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.14, 0.93, 1.07, 1], y: [0, -10, 2, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
        >
          <CircleDecor color="#06573F" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-[6%] sm:bottom-10 sm:left-[8%] lg:bottom-12 lg:left-[11%] w-5 sm:w-6 lg:w-7"
        initial={{ opacity: 0, y: 180, scale: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          ...SPRING_STAR,
          delay: 0.48,
          opacity: { duration: 0.15, delay: 0.48 },
        }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        >
          <Star color="#c9f242" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-3 sm:bottom-8 sm:right-[3%] lg:bottom-10 lg:right-[7%] w-7 sm:w-9 lg:w-10"
        initial={{ opacity: 0, x: 120, y: 120, scale: 0.2 }}
        animate={{ opacity: 0.75, x: 0, y: 0, scale: 1 }}
        transition={{
          ...SPRING_CIRCLE,
          delay: 0.60,
          opacity: { duration: 0.15, delay: 0.60 },
        }}
      >
        <motion.div
          initial={{ rotate: 20 }}
          animate={{ y: [0, -14, -4, 3, 0], rotate: [20, 28, 12, 24, 20] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <CircleDecor color="#f16012" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden lg:block absolute bottom-[28%] left-[7%] w-5"
        initial={{ opacity: 0, y: 130, scale: 0 }}
        animate={{ opacity: 0.7, y: 0, scale: 1 }}
        transition={{
          ...SPRING_STAR,
          delay: 0.72,
          opacity: { duration: 0.15, delay: 0.72 },
        }}
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}
        >
          <Star color="#06573F" />
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[53%] right-[15%] w-10"
        initial={{ opacity: 0, x: 140, y: -110, scale: 0 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{
          ...SPRING_STAR,
          delay: 0.84,
          opacity: { duration: 0.15, delay: 0.84 },
        }}
      >
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
        >
          <Star color="#06573F" />
        </motion.div>
      </motion.div>

    </div>
  );
}

export function CategoriesDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-8 right-4 sm:top-10 sm:right-[4%] lg:right-[6%] w-6 sm:w-7 lg:w-8"
        initial={{ opacity: 0, y: -50, scale: 0 }}
        whileInView={{ opacity: 0.7, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.1 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="absolute -bottom-16 -left-10 sm:-left-6 w-40 sm:w-52 lg:w-60 opacity-[0.07]"
        initial={{ opacity: 0, x: -60, scale: 0.6 }}
        whileInView={{ opacity: 0.07, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.2 }}
      >
        <CircleDecor color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[40%] -right-5 w-16 opacity-40"
        initial={{ opacity: 0, x: 50, rotate: 40 }}
        whileInView={{ opacity: 0.4, x: 0, rotate: 25 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute bottom-4 right-[5%] w-14 opacity-30"
        initial={{ opacity: 0, y: 40, rotate: -20 }}
        whileInView={{ opacity: 0.3,x: -80, y: 0, rotate: -5 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.4 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-8 left-[5%] sm:left-[8%] w-5"
        initial={{ opacity: 0, y: 40, scale: 0 }}
        whileInView={{ opacity: 0.5, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.25 }}
      >
        <Star color="#06573F" />
      </motion.div>

    </div>
  );
}

export function HowItWorksDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-6 right-3 sm:top-10 sm:right-[3%] lg:top-12 lg:right-[5%] w-14 sm:w-16 lg:w-20 opacity-60"
        initial={{ opacity: 0, x: 60, y: -40, rotate: 30 }}
        whileInView={{ opacity: 0.6, x: 0, y: 0, rotate: 18 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.1 }}
      >
        <LeafFull />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-[4%] sm:bottom-12 sm:left-[6%] w-5 sm:w-6"
        initial={{ opacity: 0, y: 50, scale: 0 }}
        whileInView={{ opacity: 0.65, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.2 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="absolute -bottom-14 -right-10 w-44 sm:w-56 lg:w-64 opacity-[0.07]"
        initial={{ opacity: 0, x: 50, scale: 0.6 }}
        whileInView={{ opacity: 0.07, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <CircleDecor color="#f16012" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[25%] right-[9%] w-5 opacity-50"
        initial={{ opacity: 0, scale: 0, x: 30 }}
        whileInView={{ opacity: 0.5, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_SECTION, delay: 0.35 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-8 left-[4%] w-12 opacity-25"
        initial={{ opacity: 0, x: -40, rotate: -30 }}
        whileInView={{ opacity: 0.25, x: 0, rotate: -15 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.25 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

    </div>
  );
}

export function AboutDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-8 right-4 sm:top-12 sm:right-[5%] lg:right-[8%] w-6 sm:w-7"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.7,x: -20, y: 80, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.1 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="absolute top-8 right-4 sm:top-12 sm:right-[5%] lg:right-[8%] w-6 sm:w-7"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.3,x: 20, y: 400, scale: 2 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.15 }}
      >
        <CircleDecor color="#c9f242" />
      </motion.div>

      
      <motion.div
        className="hidden lg:block absolute top-[42%] -left-4 w-14 opacity-20"
        initial={{ opacity: 0, x: -40, rotate: -40 }}
        whileInView={{ opacity: 0.2, x: 0, rotate: -20 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-[5%] sm:right-[8%] w-5 sm:w-6 opacity-40"
        initial={{ opacity: 0, y: 40, scale: 0 }}
        whileInView={{ opacity: 0.4, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.25 }}
      >
        <Star color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute -bottom-8 left-[2%] w-16 sm:w-20 opacity-20"
        initial={{ opacity: 0, x: -30, y: 30 }}
        whileInView={{ opacity: 0.2, x: 0, y: -200 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.35 }}
      >
        <LeafFull />
      </motion.div>

    </div>
  );
}

export function VideoDemoDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-8 right-4 sm:top-10 sm:right-[4%] w-6 sm:w-7"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.65, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.1 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="absolute -bottom-12 -right-8 w-16 opacity-[0.08]"
        initial={{ opacity: 0, x: 0, scale: 0.6 }}
        whileInView={{ opacity: 0.07, x: 0,y: -240, scale: 4 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.2 }}
      >
        <CircleDecor color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-6 left-[3%] w-12 sm:w-14 opacity-25"
        initial={{ opacity: 0, x: -40, rotate: -30 }}
        whileInView={{ opacity: 0.25, x: 0, rotate: -15 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.15 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute bottom-8 left-[6%] w-5 opacity-45"
        initial={{ opacity: 0, y: 30, scale: 0 }}
        whileInView={{ opacity: 0.45, y: 0, scale: 1.5 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute -bottom-6 right-[8%] w-16 opacity-20"
        initial={{ opacity: 0, y: 30, rotate: 20 }}
        whileInView={{ opacity: 0.2, y: -45, rotate: 10 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.35 }}
      >
        <LeafFull />
      </motion.div>

    </div>
  );
}

export function FaqDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-8 right-4 sm:top-12 sm:right-[5%] w-6 sm:w-7 opacity-70"
        initial={{ opacity: 0, scale: 0, y: -30 }}
        whileInView={{ opacity: 0.7, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.1 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="absolute -bottom-16 -left-10 w-48 sm:w-60 lg:w-72 opacity-[0.06]"
        initial={{ opacity: 0, scale: 0.5, x: -40 }}
        whileInView={{ opacity: 0.06, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING_SECTION, delay: 0.2 }}
      >
        <CircleDecor color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[35%] -right-4 w-14 opacity-20"
        initial={{ opacity: 0, x: 40, rotate: 40 }}
        whileInView={{ opacity: 0.2, x: 0, rotate: 22 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_SECTION, delay: 0.25 }}
      >
        <LeafEmpty color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-10 right-[5%] w-5 sm:w-6 opacity-40"
        initial={{ opacity: 0, y: 30, scale: 0 }}
        whileInView={{ opacity: 0.4, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <Star color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-8 left-[4%] w-5 opacity-35"
        initial={{ opacity: 0, scale: 0, x: -20 }}
        whileInView={{ opacity: 0.35, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.15 }}
      >
        <Star color="#c9f242" />
      </motion.div>
      
      <motion.div
        className="hidden lg:block absolute bottom-8 left-[6%] w-5 opacity-45"
        initial={{ opacity: 0, y: 30, scale: 0 }}
        whileInView={{ opacity: 0.45,x: -320, y: -80, scale: 3 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <CircleDecor color="#f16012" />
      </motion.div>

    </div>
  );
}

export function DeclarerLotDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

      <motion.div
        className="absolute top-8 right-4 sm:top-12 sm:right-[5%] w-6 sm:w-7"
        initial={{ opacity: 0, y: -40, scale: 0 }}
        whileInView={{ opacity: 0.65, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.1 }}
      >
        <Star color="#f16012" />
      </motion.div>

      <motion.div
        className="absolute -bottom-12 -left-8 w-44 sm:w-56 lg:w-64 opacity-[0.07]"
        initial={{ opacity: 0, x: -50, scale: 0.6 }}
        whileInView={{ opacity: 0.07, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ ...SPRING_SECTION, delay: 0.2 }}
      >
        <CircleDecor color="#06573F" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[30%] -right-4 w-14 opacity-20"
        initial={{ opacity: 0, x: 40, rotate: 40 }}
        whileInView={{ opacity: 0.2, x: 0, rotate: 22 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_SECTION, delay: 0.25 }}
      >
        <LeafEmpty color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-[55%] -left-4 w-12 opacity-[0.18]"
        initial={{ opacity: 0, x: -40, rotate: -30 }}
        whileInView={{ opacity: 0.18, x: 0, rotate: -15 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...SPRING_SECTION, delay: 0.3 }}
      >
        <LeafFull />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-[4%] w-4 sm:w-5"
        initial={{ opacity: 0, y: 30, scale: 0 }}
        whileInView={{ opacity: 0.4, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.2 }}
      >
        <Star color="#c9f242" />
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-6 left-[5%] w-4"
        initial={{ opacity: 0, y: 20, scale: 0 }}
        whileInView={{ opacity: 0.3, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING_STAR, delay: 0.15 }}
      >
        <Star color="#06573F" />
      </motion.div>

    </div>
  );
}
