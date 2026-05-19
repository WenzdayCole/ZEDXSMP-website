"use client";

import { motion } from "framer-motion";
import { useClientSnapshot } from "@/hooks/useClientSnapshot";

function createStarField(count) {
  return Array.from({ length: count })
    .map(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.7 + 0.3;
      return `${x}vw ${y}vh rgba(255, 255, 255, ${opacity})`;
    })
    .join(", ");
}

export default function SpaceBackground() {
  const stars = useClientSnapshot(() => ({
    slow: createStarField(150),
    mid: createStarField(100),
    fast: createStarField(50),
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: stars ? 1 : 0 }}
      transition={{ duration: 2 }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050208]"
      aria-hidden
    >
      {stars && (
        <>
          <motion.div
            style={{ boxShadow: stars.slow }}
            className="absolute h-px w-px animate-parallax-infinite bg-transparent"
          />
          <motion.div
            style={{ boxShadow: stars.mid }}
            className="absolute h-0.5 w-0.5 animate-parallax-infinite bg-transparent [animation-duration:80s]"
          />
          <motion.div
            style={{ boxShadow: stars.fast }}
            className="absolute h-0.5 w-0.5 animate-parallax-infinite bg-transparent [animation-duration:40s]"
          />
        </>
      )}
    </motion.div>
  );
}
