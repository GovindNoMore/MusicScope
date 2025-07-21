export interface AnalysisResult {
  artists_analyzed: number;
  total_genres_found: number;
  language: string;
  taste_profile: string;
  artist_data: ArtistData[];
  dominant_genres: string[];
  genre_distribution: { genre: string; percentage: number }[];
  underrated_recommendations: ArtistData[]; // <-- changed this line
  popular_recommendations: ArtistData[];
}

export interface ArtistData {
  name: string;
  image: string;
  genres: string[];
  spotifyUrl?: string;
}