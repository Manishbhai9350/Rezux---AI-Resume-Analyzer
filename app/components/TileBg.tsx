import { useEffect, useMemo, useRef, useState } from "react";

const DECAY_DESKTOP = 0.03;
const DECAY_MOBILE = 0.0015;
const TILE_SIZE = 60;
const MOBILE_WIDTH = 800;
const MOBILE_MIN = 500;
const MOBILE_MAX = 200;

type TileBgProps = {
  parentRef: React.RefObject<HTMLDivElement | null>;
};

const TileBg: React.FC<TileBgProps> = ({ parentRef }) => {
  const [dims, setDims] = useState({ rows: 0, cols: 0 });
  const [isPassive, setIsPassive] = useState(false);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heat = useRef<number[]>([]);
  const randomIntervalRef = useRef<number | null>(null);

  /* -------------------- Parent resize detection -------------------- */
  useEffect(() => {
    if (!parentRef.current) return;

    const update = () => {
      if (!parentRef.current) return;

      const { width, height } =
        parentRef.current.getBoundingClientRect();

      setDims({
        rows: Math.ceil(height / TILE_SIZE),
        cols: Math.ceil(width / TILE_SIZE),
      });

      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        width < MOBILE_WIDTH;

      setIsPassive(isTouch);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(parentRef.current);

    return () => observer.disconnect();
  }, [parentRef]);

  const TILE_COUNT = dims.rows * dims.cols;
  const tiles = useMemo(() => Array.from({ length: TILE_COUNT }), [TILE_COUNT]);

  /* -------------------- Resize buffers -------------------- */
  useEffect(() => {
    heat.current = Array(TILE_COUNT).fill(0);
    tileRefs.current = [];
  }, [TILE_COUNT]);

  /* -------------------- Animation loop -------------------- */
  useEffect(() => {
    if (!TILE_COUNT) return;

    let raf: number;

    const animate = () => {
      const decay = isPassive ? DECAY_MOBILE : DECAY_DESKTOP;

      for (let i = 0; i < heat.current.length; i++) {
        heat.current[i] = Math.max(0, heat.current[i] - decay);

        const el = tileRefs.current[i];
        if (!el) continue;

        el.style.backgroundColor = `rgba(125,211,252,${heat.current[i]})`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [TILE_COUNT, isPassive]);

  /* -------------------- Passive random trail (mobile) -------------------- */
  useEffect(() => {
    if (!isPassive || !TILE_COUNT) return;

    const triggerRandomTile = () => {
      heat.current[Math.floor(Math.random() * TILE_COUNT)] = 1;
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

  /* -------------------- MOUSE MOVE HANDLING (KEY PART) -------------------- */
  useEffect(() => {
    if (isPassive || !parentRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x <= 0 || y <= 0 || x >= rect.width || y >= rect.height) return;

      const col = Math.round((x / rect.width) * dims.cols);
      const row = Math.round((y / rect.height) * dims.rows);

      const index = row * dims.cols + col;

      if (index >= 0 && index < heat.current.length) {
        heat.current[index] = 1;
      }
    };

    parentRef.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      parentRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dims, isPassive, parentRef]);

  return (
    <div ref={gridRef} className="absolute inset-0 z-0 overflow-hidden opacity-40 pointer-events-none">
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
            ref={(el) => {(tileRefs.current[i] = el)}}
          />
        ))}
      </div>

      {/* Fades */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[25rem] bg-gradient-to-t from-sky-500/30 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-full bg-gradient-to-r from-sky-500/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-40 h-full bg-gradient-to-l from-rose-400/30 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/30 to-transparent" />
    </div>
  );
};

export default TileBg;
