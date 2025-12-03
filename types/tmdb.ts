export interface TMDBPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
}

export interface TMDBSearchPersonResponse {
  page: number;
  results: TMDBPersonResult[];
  total_results: number;
  total_pages: number;
}

export interface TMDBMovieCredit {
  id: number;
  title?: string;
  name?: string; // Some entries may use name for TV credits
  release_date?: string; // Movie
  first_air_date?: string; // TV
  poster_path: string | null;
  media_type?: string;
  character?: string;
}

export interface TMDBMovieCreditsResponse {
  id: number;
  cast: TMDBMovieCredit[];
  crew: TMDBMovieCredit[];
}

export interface NormalizedMovieCredit {
  id: number;
  title: string;
  releaseYear: string;
  posterUrl: string | null;
}

export interface TMDBImageProfile {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string | null;
  vote_average?: number;
  vote_count?: number;
}

export interface TMDBPersonImagesResponse {
  id: number;
  profiles: TMDBImageProfile[];
}

export interface TMDBPopularPersonsResponse {
  page: number;
  results: TMDBPersonResult[];
  total_results: number;
  total_pages: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

export interface TMDBTrendingMoviesResponse {
  page: number;
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

export interface TMDBMovieDetailsResponse extends TMDBMovie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
}
