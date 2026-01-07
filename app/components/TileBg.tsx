import { useEffect, useMemo, useRef, useState } from "react";

const DECAY_DESKTOP = 0.03;
const DECAY_MOBILE = 0.0015; // slower = stays longer
const TILE_SIZE = 60;
const MOBILE_WIDTH = 800;
const MOBILE_MIN = 500;
const MOBILE_MAX = 200


const TileBg: React.FC = () => {
  const [dims, setDims] = useState({ rows: 0, cols: 0 });
  const [isPassive, setIsPassive] = useState(false);

  /* -------------------- Screen + device detection -------------------- */
  useEffect(() => {
    const update = () => {
      setDims({
        rows: Math.ceil(window.innerHeight / TILE_SIZE),
        cols: Math.ceil(window.innerWidth / TILE_SIZE),
      });

      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < MOBILE_WIDTH;

      setIsPassive(isTouch);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const TILE_COUNT = dims.rows * dims.cols;

  const tiles = useMemo(() => Array.from({ length: TILE_COUNT }), [TILE_COUNT]);

  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heat = useRef<number[]>([]);
  const randomIntervalRef = useRef<number | null>(null);

  /* -------------------- Resize buffers safely -------------------- */
  useEffect(() => {
    heat.current = Array(TILE_COUNT).fill(0);
    tileRefs.current = [];
  }, [TILE_COUNT]);

  /* -------------------- Animation loop -------------------- */
  useEffect(() => {
    if (!TILE_COUNT) return;

    let raf: number;

    const animate = () => {
      for (let i = 0; i < heat.current.length; i++) {
        const decay = isPassive ? DECAY_MOBILE : DECAY_DESKTOP;
        heat.current[i] = Math.max(0, heat.current[i] - decay);

        const el = tileRefs.current[i];
        if (!el) continue;

        el.style.backgroundColor = `rgba(125,211,252,${heat.current[i]})`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [TILE_COUNT]);

  /* -------------------- Passive random trail (mobile) -------------------- */
  useEffect(() => {
    if (!isPassive || !TILE_COUNT) return;

    const triggerRandomTile = () => {
      const index = Math.floor(Math.random() * TILE_COUNT);
      heat.current[index] = 1;
    };

    randomIntervalRef.current = window.setInterval(
      triggerRandomTile,
      MOBILE_MIN + Math.random() * MOBILE_MAX
    );

    return () => {
      if (randomIntervalRef.current !== null) {
        clearInterval(randomIntervalRef.current);
      }
    };
  }, [isPassive, TILE_COUNT]);

  /* -------------------- Mouse interaction (desktop only) -------------------- */
  const handleEnter = (i: number) => {
    if (isPassive) return;
    heat.current[i] = 1;
  };

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${dims.cols}, 1fr)`,
          gridTemplateRows: `repeat(${dims.rows}, 1fr)`,
        }}
      >
        {tiles.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            onMouseEnter={() => handleEnter(i)}
            className="border-[.5px] border-slate-400"
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[25rem] bg-gradient-to-t from-white to-transparent" />

      {/* Left fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-full bg-gradient-to-r from-white to-transparent" />

      {/* Right fade */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-40 h-full bg-gradient-to-l from-white to-transparent" />

      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />
    </div>
  );
};

export default TileBg;
