"use client";
import { useState } from "react";
import Image from "next/image";

interface MovieCardProps {
  title: string;
  posterUrl: string;
  overview: string;
  voteAverage: number;
  releaseYear: string;
}

export default function MovieCard({ title, posterUrl, overview, voteAverage, releaseYear }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative snap-start flex-none w-56 aspect-[2/3] bg-zinc-100 dark:bg-zinc-800 rounded overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src={posterUrl} alt={title} fill sizes="224px" className="object-cover" />
      
      {/* Slide-up overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/90 to-transparent p-4 transition-all duration-300 ${
          isHovered ? "translate-y-0 h-full" : "translate-y-full h-0"
        }`}
      >
        <div className="flex flex-col justify-end h-full">
          <h3 className="font-semibold text-white mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 bg-yellow-500 text-black font-semibold rounded">
              ⭐ {voteAverage.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-300">{releaseYear}</span>
          </div>
          <p className="text-xs text-zinc-300 mb-3 line-clamp-3">{overview}</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded backdrop-blur-sm transition-colors">
            More
          </button>
        </div>
      </div>
    </div>
  );
}
