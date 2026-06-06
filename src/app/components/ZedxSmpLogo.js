/** Server-rendered hero logo — keep in first HTML paint for LCP. */
export default function ZedxSmpLogo() {
  return (
    <div className="zedx-logo relative mx-auto flex flex-col items-center">
      <div className="zedx-logo-glow pointer-events-none absolute left-1/2 top-1/2 h-[min(70vw,28rem)] w-[min(90vw,36rem)] -translate-x-1/2 -translate-y-[42%] rounded-full bg-purple-600/25 blur-[80px]" />

      <div className="zedx-logo-frame relative mb-3 sm:mb-4">
        <span className="zedx-logo-corner zedx-logo-corner-tl" aria-hidden />
        <span className="zedx-logo-corner zedx-logo-corner-tr" aria-hidden />
        <span className="zedx-logo-corner zedx-logo-corner-bl" aria-hidden />
        <span className="zedx-logo-corner zedx-logo-corner-br" aria-hidden />

        <svg
          className="zedx-logo-emblem relative z-10 h-14 w-14 sm:h-16 sm:w-16"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="zedx-emblem-grad" x1="8" y1="8" x2="56" y2="56">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="45%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="zedx-emblem-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
            stroke="url(#zedx-emblem-grad)"
            strokeWidth="2.5"
            fill="rgba(168,85,247,0.08)"
          />
          <path
            d="M20 18H44L20 46H44"
            stroke="url(#zedx-emblem-grad)"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
            filter="url(#zedx-emblem-glow)"
          />
          <circle cx="32" cy="32" r="3" fill="#e9d5ff" />
        </svg>
      </div>

      <h1 className="zedx-logo-title relative z-10 select-none text-center uppercase italic leading-[0.82] tracking-tighter">
        <span className="zedx-logo-zedx block text-[clamp(3.25rem,17vw,9.5rem)] font-black">
          ZEDX
        </span>
        <span className="zedx-logo-smp zedx-logo-shimmer mt-1 block text-[clamp(1.75rem,9.5vw,5.25rem)] font-black tracking-[0.22em] sm:tracking-[0.28em]">
          SMP
        </span>
      </h1>

      <div
        className="relative z-10 mt-4 flex items-center gap-3 sm:mt-5"
        aria-hidden
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-purple-500/70 sm:w-14" />
        <span className="text-[8px] font-black uppercase tracking-[0.55em] text-purple-300/80 sm:text-[9px]">
          Vanilla+
        </span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-purple-500/70 sm:w-14" />
      </div>
    </div>
  );
}
