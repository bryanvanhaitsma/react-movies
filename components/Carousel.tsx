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
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <button
          aria-label="Previous"
          onClick={() => scrollBy(-400)}
          className="rounded border px-3 py-1 text-sm bg-white dark:bg-zinc-900"
        >
          ◀
        </button>
        <button
          aria-label="Next"
          onClick={() => scrollBy(400)}
          className="rounded border px-3 py-1 text-sm bg-white dark:bg-zinc-900"
        >
          ▶
        </button>
      </div>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
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