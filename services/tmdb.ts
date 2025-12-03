import { NormalizedMovieCredit, TMDBMovieCreditsResponse, TMDBPersonImagesResponse, TMDBSearchPersonResponse } from "../types/tmdb";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const DEFAULT_POSTER_SIZE = "w342";
const DEFAULT_PROFILE_SIZE = "w780";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY environment variable not set");
  return key;
}

async function tmdbFetch<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T> {
  const apiKey = getApiKey();
  const url = new URL(`${TMDB_API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`TMDB request failed ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function searchPersonByName(name: string) {
  const data = await tmdbFetch<TMDBSearchPersonResponse>("/search/person", { query: name, include_adult: false });
  return data.results;
}

export async function getPersonMovieCredits(personId: number) {
  return tmdbFetch<TMDBMovieCreditsResponse>(`/person/${personId}/movie_credits`);
}

export async function getPersonImages(personId: number) {
  return tmdbFetch<TMDBPersonImagesResponse>(`/person/${personId}/images`, {
    include_image_language: "en,null",
  });
}

export function imageUrl(path: string, size: string = DEFAULT_PROFILE_SIZE) {
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function normalizeMovieCredits(resp: TMDBMovieCreditsResponse): NormalizedMovieCredit[] {
  return resp.cast
    .filter(c => c.media_type === "movie" || c.release_date)
    .map(c => {
      const title = c.title || c.name || "Untitled";
      const date = c.release_date || "";
      const year = date ? date.split("-")[0] : "";
      const posterUrl = c.poster_path ? imageUrl(c.poster_path, DEFAULT_POSTER_SIZE) : null;
      return {
        id: c.id,
        title,
        releaseYear: year,
        posterUrl,
      } as NormalizedMovieCredit;
    })
    .sort((a, b) => Number(b.releaseYear) - Number(a.releaseYear));
}