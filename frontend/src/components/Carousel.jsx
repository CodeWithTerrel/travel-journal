import { useEffect, useRef, useState } from "react";

// Put your images in:  /frontend/public/hero/
// Example files: 1.jpg, 2.jpg, 3.jpg
const IMAGES = ["/hero/1.jpg", "/hero/2.jpg", "/hero/3.jpg"];

export default function Carousel({
                                     intervalMs = 2000,              // auto-advance every 2s
                                     ratio = "aspect-[16/9]",        // keep a fixed aspect ratio
                                 }) {
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);
    const pausedRef = useRef(false);

    useEffect(() => {
        // autoplay loop
        const tick = () => {
            if (!pausedRef.current) {
                setIndex((i) => (i + 1) % IMAGES.length);
            }
        };
        timerRef.current = setInterval(tick, intervalMs);
        return () => clearInterval(timerRef.current);
    }, [intervalMs]);

    const go = (dir) => setIndex((i) => (i + dir + IMAGES.length) % IMAGES.length);

    return (
        <div
            className={`relative w-full ${ratio} rounded-xl overflow-hidden bg-slate-200`}
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
        >
            {/* Slide track */}
            <div
                className="h-full w-full flex transition-transform duration-500"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {IMAGES.map((src) => (
                    <div key={src} className="min-w-full h-full">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {/* object-cover => fills box without distortion (may crop a bit) */}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1.5 rounded-md"
            >
                ‹
            </button>
            <button
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1.5 rounded-md"
            >
                ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
                {IMAGES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
