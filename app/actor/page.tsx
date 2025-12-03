"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ActorPage() {
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: number; name: string; profile_path: string | null }>>([]);
  const [open, setOpen] = useState(false);
  const [trending, setTrending] = useState<Array<{ id: number; name: string; profile_path: string | null }>>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = name.trim();
    if (!q) return;
    router.push(`/actor/${encodeURIComponent(q)}`);
  }

  // Debounced autosuggest (500ms)
  const debouncedName = useDebounce(name, 500);

  useEffect(() => {
    const q = debouncedName.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const run = async () => {
      try {
        const res = await fetch(`/api/actor/suggest?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data.results || []);
        setOpen((data.results || []).length > 0);
      } catch (e) {
        // ignore aborts/errors
      }
    };
    run();
    return () => controller.abort();
  }, [debouncedName]);

  function onPick(name: string) {
    setOpen(false);
    router.push(`/actor/${encodeURIComponent(name)}`);
  }

  // Fetch trending actors on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/actor/trending");
        if (!res.ok) return;
        const data = await res.json();
        setTrending(data.results || []);
      } catch (e) {
        // ignore errors
      }
    };
    fetchTrending();
  }, []);

  const scrollCarousel = (direction: number) => {
    carouselRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold mb-6">Actor Search</h1>
      
      {trending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium">Trending Actors</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(-1)}
                className="rounded border px-3 py-1 text-sm bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Previous"
              >
                ◀
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                className="rounded border px-3 py-1 text-sm bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Next"
              >
                ▶
              </button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
          >
            {trending.map((actor) => (
              <Link
                key={actor.id}
                href={`/actor/${encodeURIComponent(actor.name)}`}
                className="snap-start flex-none group"
              >
                <div className="w-32 flex flex-col items-center gap-2">
                  {actor.profile_path ? (
                    <div className="relative w-32 h-48 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 group-hover:ring-2 ring-zinc-400 transition">
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-48 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                      No Image
                    </div>
                  )}
                  <p className="text-sm font-medium text-center line-clamp-2 w-full">{actor.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <form onSubmit={onSearch} className="mb-8">
        <div className="relative">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Type an actor's name (e.g. Tom Hanks)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setOpen(suggestions.length > 0)}
              className="flex-1 rounded border border-zinc-300 bg-white px-4 py-2 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="rounded bg-black text-white px-6 py-2 font-medium dark:bg-zinc-200 dark:text-black"
            >
              Search
            </button>
          </div>
          {open && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-2 w-full rounded-md border border-zinc-200 bg-white shadow-lg dark:bg-zinc-900 dark:border-zinc-700">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onPick(s.name)}
                >
                  {s.profile_path ? (
                    <div className="relative w-8 h-12 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <Image src={`https://image.tmdb.org/t/p/w92${s.profile_path}`} alt={s.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-12 rounded bg-zinc-100 dark:bg-zinc-800" />
                  )}
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
