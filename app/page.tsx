import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { getTrendingMovies, imageUrl } from "@/services/tmdb";

export default async function Home() {
  const trendingData = await getTrendingMovies("week");
  
  // Sort by popularity (TMDB's popularity metric correlates with box office/ticket sales)
  // Higher popularity = more ticket sales and viewership
  const movies = trendingData.results
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);
  
  // Get a high-rated backdrop for hero
  const heroMovie = movies.find(m => m.backdrop_path && m.vote_average > 7) || movies[0];
  
  // Prepare carousel images
  const carouselImages = movies
    .filter(m => m.poster_path)
    .map(m => ({
      url: imageUrl(m.poster_path!, "w500"),
      alt: m.title
    }));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Backdrop Image */}
        {heroMovie.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl(heroMovie.backdrop_path, "original")}
              alt={heroMovie.title}
              fill
              priority
              className="object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-zinc-950/40" />
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end">
          <div className="max-w-7xl mx-auto px-6 pb-16 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {heroMovie.title}
              </h1>
              <p className="text-lg md:text-xl text-zinc-200 mb-6 line-clamp-3 drop-shadow-md">
                {heroMovie.overview}
              </p>
              <div className="flex gap-4 items-center">
                <span className="px-3 py-1 bg-yellow-500 text-black font-semibold rounded text-sm">
                  ⭐ {heroMovie.vote_average.toFixed(1)}
                </span>
                <span className="text-zinc-300">
                  {heroMovie.release_date ? new Date(heroMovie.release_date).getFullYear() : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Trending This Week</h2>
          <Link href="/actor" className="text-zinc-400 hover:text-white transition-colors">
            Explore Actors →
          </Link>
        </div>
        <Carousel images={carouselImages} />
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Discover Your Next Favorite</h3>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Search for actors to explore their filmography, or browse trending movies to find your next watch.
        </p>
        <Link 
          href="/actor"
          className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Search Actors
        </Link>
      </div>
    </div>
  );
}
