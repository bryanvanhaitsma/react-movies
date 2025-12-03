import Image from "next/image";
import Carousel from "@/components/Carousel";
import { getPersonImages, getPersonMovieCredits, normalizeMovieCredits, searchPersonByName, imageUrl } from "../../../services/tmdb";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ActorSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const query = slug;
  const people = await searchPersonByName(query);
  if (!people.length) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">No results for "{slug}"</h1>
        <p className="mt-4 text-zinc-600"><a className="underline" href="/actor">Try another search</a></p>
      </div>
    );
  }
  const actor = people[0];
  const [imagesResp, creditsResp] = await Promise.all([
    getPersonImages(actor.id),
    getPersonMovieCredits(actor.id),
  ]);
  const photos = imagesResp.profiles
    .slice(0, 15)
    .map((p) => ({ url: imageUrl(p.file_path, "w780"), alt: `${actor.name} photo` }));
  const movies = normalizeMovieCredits(creditsResp);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-4 mb-6">
        {actor.profile_path && (
          <div className="relative w-16 h-16 rounded overflow-hidden">
            <Image src={imageUrl(actor.profile_path, "w185")} alt={actor.name} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-semibold">{actor.name}</h1>
      </div>

      <h2 className="text-xl font-medium mb-3">Photos</h2>
      <Carousel images={photos} />

      <h2 className="text-xl font-medium mt-10 mb-4">Movies</h2>
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {movies.map((m) => (
          <div key={m.id} className="group rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col">
            {m.posterUrl ? (
              <div className="relative aspect-[2/3] w-full bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={m.posterUrl}
                  alt={m.title}
                  fill
                  sizes="(max-width: 768px) 45vw, (max-width: 1200px) 20vw, 12vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[2/3] flex items-center justify-center text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800">No Image</div>
            )}
            <div className="p-2 flex flex-col gap-1">
              <p className="text-sm font-medium leading-tight line-clamp-2">{m.title}</p>
              <p className="text-xs text-zinc-500">{m.releaseYear}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
