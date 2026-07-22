import { useEffect, useRef, useState } from 'react';

const features = [
  {
    title: 'Recherche par université',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Z" />
        <path d="M5 10.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-5.5" />
      </svg>
    ),
  },
  {
    title: 'Compatibilité colocataire',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="8" cy="8" r="3.2" />
        <circle cx="16" cy="8" r="3.2" />
        <path d="M2.5 20c0-3 2.5-5.3 5.5-5.3s5.5 2.3 5.5 5.3M10.5 20c0-3 2.5-5.3 5.5-5.3s5.5 2.3 5.5 5.3" />
      </svg>
    ),
  },
  {
    title: 'Messagerie intégrée',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.34 8.5H12a8.28 8.28 0 0 1-4.15-1.1L3 20l1.15-4.65A8.38 8.38 0 0 1 3.5 11.5 8.38 8.38 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
      </svg>
    ),
  },
  {
    title: 'Réservation en ligne',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M16 3v3M8 3v3M3 9.5h18" />
        <path d="m8 14 2.5 2.5L16 11" />
      </svg>
    ),
  },
  {
    title: 'Publier des annonces',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M4 20.5v-3.6L16.4 4.5a1.5 1.5 0 0 1 2.1 0l1 1a1.5 1.5 0 0 1 0 2.1L7.1 20H4Z" />
        <path d="M14.5 6.5 17.5 9.5" />
      </svg>
    ),
  },
  {
    title: 'Comptes vérifiés',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 3 4.5 6v6c0 4.5 3 7.7 7.5 9 4.5-1.3 7.5-4.5 7.5-9V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

function polarToXY(angleDeg, radius) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: radius * Math.cos(angleRad),
    y: radius * Math.sin(angleRad),
  };
}

export default function FeaturesOrbit() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const intervalRef = useRef(null);

  const startLoop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex(current => (current + 1) % features.length);
    }, 3000);
  };

  useEffect(() => {
    startLoop();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleMouseEnter = (index) => {
    clearInterval(intervalRef.current);
    setHoveredIndex(index);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    startLoop();
  };

  const count = features.length;
  const startAngle = -90;
  const endAngle = 90;
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <div className="relative mx-auto h-[420px] w-[260px] sm:h-[480px] sm:w-[300px]">
      {features.map((feature, index) => {
        const angle = startAngle + step * index;
        const radius = 150;
        const { x, y } = polarToXY(angle, radius);
        const isActive = hoveredIndex !== null ? index === hoveredIndex : index === activeIndex;

        return (
          <div
            key={feature.title}
            className="absolute right-0 top-1/2 flex flex-row-reverse items-center gap-3 transition-all duration-500"
            style={{
              transform: `translate(${-x}px, calc(-50% + ${y}px))`,
            }}
          >
            <div
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-500 ${
                isActive
                  ? 'scale-110 border-transparent bg-amber-400 text-slate-950 shadow-lg shadow-amber-300/50'
                  : 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500'
              }`}
            >
              {feature.icon}
            </div>
            <div
              className={`whitespace-nowrap rounded-2xl px-3 py-2 text-right text-xs font-semibold transition-all duration-500 sm:text-sm ${
                isActive
                  ? 'bg-white text-slate-950 shadow-lg opacity-100 dark:bg-slate-900 dark:text-slate-100'
                  : 'pointer-events-none -translate-x-1 bg-transparent text-transparent opacity-0'
              }`}
            >
              {feature.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}