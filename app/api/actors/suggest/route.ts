import { NextResponse } from "next/server";
import { searchPersonByName } from "../../../../services/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ results: [] });
  }
  try {
    const people = await searchPersonByName(q.trim());
    // return top 10 names with id and profile_path
    const results = people.slice(0, 10).map((p) => ({ id: p.id, name: p.name, profile_path: p.profile_path }));
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}
