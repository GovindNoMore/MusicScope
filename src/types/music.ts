export interface AnalysisResult {
  language: string;
  artists_analyzed: number;
  artist_data: {
    name: string;
    genres: string[];
    image: string;
  }[];
  genre_distribution: {
    genre: string;
    count: number;
    percentage: number;
  }[];
  dominant_genres: string[];
  taste_profile: string;
  underrated_recommendations: {
    name: string;
    image: string;
  }[];
  popular_recommendations: {
    name: string;
    image: string;
  }[];
  total_genres_found: number;
}