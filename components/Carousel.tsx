"use client";
import { useRef } from "react";
import Image from "next/image";

export default function Carousel({ images }: { images: { url: string; alt: string }[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dx: number) => {
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  if (!images.length) return null;

  return (
    <div className="relative group">
      {/* Left scroll overlay */}
      <button
        onClick={() => scrollBy(-400)}
        aria-label="Scroll left"
        className="absolute left-0 top-0 bottom-2 w-16 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/90 to-transparent dark:from-black/90 flex items-center justify-center"
      >
        <span className="text-2xl text-zinc-800 dark:text-zinc-200">‹</span>
      </button>
      
      {/* Right scroll overlay */}
      <button
        onClick={() => scrollBy(400)}
        aria-label="Scroll right"
        className="absolute right-0 top-0 bottom-2 w-16 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white/90 to-transparent dark:from-black/90 flex items-center justify-center"
      >
        <span className="text-2xl text-zinc-800 dark:text-zinc-200">›</span>
      </button>

      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
      >
        {images.map((img, i) => (
          <div key={i} className="relative snap-start flex-none w-56 aspect-[2/3] bg-zinc-100 dark:bg-zinc-800 rounded overflow-hidden">
            <Image src={img.url} alt={img.alt} fill sizes="224px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}