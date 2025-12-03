import { NextResponse } from "next/server";
import { getTrendingMovies } from "@/services/tmdb";

export async function GET() {
  try {
    const data = await getTrendingMovies("week");
    // Sort by popularity (correlates with box office/ticket sales) and return top 20
    const results = data.results
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20)
      .map((m) => ({ 
        id: m.id, 
        title: m.title,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
        overview: m.overview,
        popularity: m.popularity
      }));
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}
