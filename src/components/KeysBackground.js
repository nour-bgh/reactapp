export default function KeysBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] dark:opacity-[0.22]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="keys-pattern"
          x="0"
          y="0"
          width="130"
          height="130"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-12)"
        >
          <g stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="24" cy="24" r="13" />
            <path d="M34 24 66 24" />
            <path d="M52 24v11M60 24v15" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#keys-pattern)" />
    </svg>
  );
}