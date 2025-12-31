import { useEffect, useState } from 'react';

type Snowflake = {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
};

export function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`
          }}
        />
      ))}
    </div>
  );
}
