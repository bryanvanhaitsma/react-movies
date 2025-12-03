import { NextResponse } from "next/server";
import { getPopularPersons } from "../../../../services/tmdb";

export async function GET() {
  try {
    const data = await getPopularPersons();
    // Return top 10 popular persons
    const results = data.results.slice(0, 10).map((p) => ({ 
      id: p.id, 
      name: p.name, 
      profile_path: p.profile_path 
    }));
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
  }
}
