import { useEffect, useRef, useState } from 'react';

function EyeBall({ size = 16, pupilSize = 6, maxDistance = 4, isBlinking = false, forceClosed = false }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMove = e => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const getPupilOffset = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    const rect = eyeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = mouse.x - centerX;
    const deltaY = mouse.y - centerY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const offset = getPupilOffset();
  const closed = isBlinking || forceClosed;

  return (
    <div
      ref={eyeRef}
      className="flex items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-200"
      style={{ width: size, height: closed ? 2 : size }}
    >
      {!closed && (
        <div
          className="rounded-full bg-slate-800"
          style={{
            width: pupilSize,
            height: pupilSize,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
}

function useRandomBlink(disabled) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (disabled) {
      setIsBlinking(false);
      return undefined;
    }
    let timeout;
    const scheduleBlink = () => {
      const delay = Math.random() * 4000 + 3000;
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, [disabled]);

  return isBlinking;
}

function useLeanTowardsMouse(ref) {
  const [skew, setSkew] = useState(0);

  useEffect(() => {
    const handleMove = e => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const deltaX = e.clientX - centerX;
      setSkew(Math.max(-6, Math.min(6, -deltaX / 120)));
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [ref]);

  return skew;
}

export default function AnimatedCharacters({ eyesClosed = false }) {
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const orangeRef = useRef(null);
  const yellowRef = useRef(null);

  const purpleBlink = useRandomBlink(eyesClosed);
  const blackBlink = useRandomBlink(eyesClosed);

  const purpleSkew = useLeanTowardsMouse(purpleRef);
  const blackSkew = useLeanTowardsMouse(blackRef);
  const orangeSkew = useLeanTowardsMouse(orangeRef);
  const yellowSkew = useLeanTowardsMouse(yellowRef);

  return (
    <div className="relative mx-auto" style={{ width: 420, height: 320 }}>
      <div
        ref={purpleRef}
        className="absolute bottom-0 rounded-t-xl transition-transform duration-500 ease-out"
        style={{ left: 50, width: 140, height: 300, backgroundColor: '#6C3FF5', zIndex: 1, transform: `skewX(${purpleSkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-6" style={{ left: 35, top: 32 }}>
          <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={purpleBlink} forceClosed={eyesClosed} />
          <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={purpleBlink} forceClosed={eyesClosed} />
        </div>
      </div>

      <div
        ref={blackRef}
        className="absolute bottom-0 rounded-t-lg transition-transform duration-500 ease-out"
        style={{ left: 180, width: 95, height: 235, backgroundColor: '#2D2D2D', zIndex: 2, transform: `skewX(${blackSkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-5" style={{ left: 20, top: 25 }}>
          <EyeBall size={14} pupilSize={5} maxDistance={3.5} isBlinking={blackBlink} forceClosed={eyesClosed} />
          <EyeBall size={14} pupilSize={5} maxDistance={3.5} isBlinking={blackBlink} forceClosed={eyesClosed} />
        </div>
      </div>

      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-transform duration-500 ease-out"
        style={{ left: 0, width: 185, height: 150, backgroundColor: '#FF9B6B', borderRadius: '95px 95px 0 0', zIndex: 3, transform: `skewX(${orangeSkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-6" style={{ left: 62, top: 65 }}>
          <EyeBall size={11} pupilSize={9} maxDistance={4} forceClosed={eyesClosed} />
          <EyeBall size={11} pupilSize={9} maxDistance={4} forceClosed={eyesClosed} />
        </div>
      </div>

      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-transform duration-500 ease-out"
        style={{ left: 235, width: 110, height: 175, backgroundColor: '#E8D754', borderRadius: '55px 55px 0 0', zIndex: 4, transform: `skewX(${yellowSkew}deg)`, transformOrigin: 'bottom center' }}
      >
        <div className="absolute flex gap-5" style={{ left: 38, top: 30 }}>
          <EyeBall size={11} pupilSize={9} maxDistance={4} forceClosed={eyesClosed} />
          <EyeBall size={11} pupilSize={9} maxDistance={4} forceClosed={eyesClosed} />
        </div>
        <div className="absolute h-1 w-14 rounded-full bg-slate-800" style={{ left: 28, top: 66 }} />
      </div>
    </div>
  );
}