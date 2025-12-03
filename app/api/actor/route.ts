import { NextResponse } from "next/server";
import { getPersonMovieCredits, normalizeMovieCredits, searchPersonByName } from "../../../services/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Missing 'name' query parameter" }, { status: 400 });
  }

  try {
    const people = await searchPersonByName(name.trim());
    if (!people.length) {
      return NextResponse.json({ actor: null, movies: [] });
    }
    // pick the first result (could be improved with disambiguation later)
    const actor = people[0];
    const creditsResp = await getPersonMovieCredits(actor.id);
    const movies = normalizeMovieCredits(creditsResp);

    return NextResponse.json({
      actor: { id: actor.id, name: actor.name },
      movies,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}
