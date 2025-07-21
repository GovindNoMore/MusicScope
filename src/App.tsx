import React, { useState } from 'react';
import { Music, Sparkles, TrendingUp, Heart, Zap, Globe } from 'lucide-react';
import type { AnalysisResult } from './types/music'; 
import MusicForm from './components/MusicForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import { getSpotifyToken, searchArtist } from './services/spotify';
import AboutSection from './components/AboutSection';
import AnalyzeSection from './components/AnalyzeSection';
import DiscoverSection from './components/DiscoverSection';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState<null | 'about' | 'analyze' | 'discover'>(null);

  // Function to get related artists using Spotify's related artists endpoint
  const getRelatedArtists = async (token: string, artistId: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        console.error('Related artists API error:', response.status);
        return [];
      }
      
      const data = await response.json();
      return data.artists || [];
    } catch (error) {
      console.error('Error fetching related artists:', error);
      return [];
    }
  };

  // Function to search artists by genre more intelligently
  const searchArtistsByGenre = async (token: string, genre: string, limit: number = 10) => {
    try {
      // More specific genre-based queries
      const queries = [
        `genre:"${genre}"`,
        `genre:${genre.replace(/\s+/g, '-')}`,  // Handle multi-word genres
        genre // Fallback to simple genre search
      ];
      
      for (const query of queries) {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}&market=US`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const artists = data.artists?.items || [];
          
          // Filter artists that actually have the genre
          const filteredArtists = artists.filter((artist: any) => 
            artist.genres && artist.genres.some((g: string) => 
              g.toLowerCase().includes(genre.toLowerCase()) ||
              genre.toLowerCase().includes(g.toLowerCase())
            )
          );
          
          if (filteredArtists.length > 0) {
            return filteredArtists;
          }
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error searching artists by genre:', error);
      return [];
    }
  };

  // Updated main recommendation function
  const getRecommendedArtists = async (token: string, userArtistData: any[], topGenres: string[]) => {
    const recommendations: any[] = [];
    const excludeIds = new Set(userArtistData.map(a => a.id).filter(Boolean));
    const excludeNames = new Set(userArtistData.map(a => a.name.toLowerCase()));

    console.log('Getting recommendations for genres:', topGenres);
    console.log('Excluding artist IDs:', Array.from(excludeIds));

    // 1. Get related artists from user's artists (most accurate method)
    console.log('Fetching related artists...');
    for (const artist of userArtistData) {
      if (recommendations.length >= 20) break;
      
      if (artist.id) {
        const relatedArtists = await getRelatedArtists(token, artist.id);
        console.log(`Found ${relatedArtists.length} related artists for ${artist.name}`);
        
        const filteredRelated = relatedArtists.filter((relArtist: any) => 
          !excludeIds.has(relArtist.id) &&
          !excludeNames.has(relArtist.name.toLowerCase()) &&
          !recommendations.some(rec => rec.id === relArtist.id) &&
          relArtist.images && relArtist.images.length > 0 &&
          relArtist.popularity > 15
        );
        
        recommendations.push(...filteredRelated.slice(0, 3));
      }
    }

    console.log(`Got ${recommendations.length} related artists`);

    // 2. Search by specific genres if we need more recommendations
    if (recommendations.length < 15 && topGenres.length > 0) {
      console.log('Searching by genres...');
      
      for (const genre of topGenres) {
        if (recommendations.length >= 20) break;
        
        const genreArtists = await searchArtistsByGenre(token, genre, 15);
        console.log(`Found ${genreArtists.length} artists for genre: ${genre}`);
        
        const filteredGenreArtists = genreArtists.filter((artist: any) => 
          !excludeIds.has(artist.id) &&
          !excludeNames.has(artist.name.toLowerCase()) &&
          !recommendations.some(rec => rec.id === artist.id) &&
          artist.images && artist.images.length > 0 &&
          artist.popularity > 20
        );
        
        recommendations.push(...filteredGenreArtists.slice(0, 4));
      }
    }

    console.log(`Final recommendations count: ${recommendations.length}`);
    return recommendations.slice(0, 15);
  };

  const handleAnalysis = async (language: string, artists: string[]) => {
    setIsAnalyzing(true);

    try {
      console.log('Starting analysis for:', { language, artists });
      
      const token = await getSpotifyToken();
      console.log('Got Spotify token:', token ? 'Success' : 'Failed');
      
      // Fetch Spotify data for each artist
      const artistData = await Promise.all(
        artists.map(async (name) => {
          try {
            console.log('Searching for artist:', name);
            const artist = await searchArtist(name, token);
            if (!artist) {
              console.log('Artist not found:', name);
              return null;
            }
            console.log('Found artist:', artist.name, 'ID:', artist.id, 'Image:', artist.images?.[0]?.url);
            return {
              id: artist.id, // IMPORTANT: Include the ID for related artists
              name: artist.name || "Unknown Artist",
              genres: artist.genres || [],
              image: artist.images?.[0]?.url || '', 
              spotifyUrl: artist.external_urls?.spotify || '#',
              popularity: artist.popularity ?? 0,
            };
          } catch (error) {
            console.error('Error searching for artist:', name, error);
            return null;
          }
        })
      );

      // Filter out any nulls (artists not found)
      const validArtists = artistData.filter(Boolean) as Array<
        NonNullable<typeof artistData[number]>
      >;

      console.log('Valid artists found:', validArtists.length);
      console.log('Valid artists:', validArtists.map(a => ({ name: a.name, id: a.id, genres: a.genres })));

      if (validArtists.length === 0) {
        console.log('No artists found on Spotify. Please check your Spotify API credentials.');
        alert('No artists found on Spotify. Please check your Spotify API credentials.');
        setIsAnalyzing(false);
        return;
      }

      // Collect all genres for genre distribution
      const allGenres = validArtists.flatMap((a) => a.genres);
      const genreCounts = allGenres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const genreDistribution = Object.entries(genreCounts).map(([genre, count]) => ({
        genre,
        count,
        percentage: Math.round((count / allGenres.length) * 100),
      }));

      const topGenres = genreDistribution
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(g => g.genre);
        
      console.log('Top genres:', topGenres);

      // Get recommended artists using improved logic
      const recommendedArtists = await getRecommendedArtists(
        token, 
        validArtists, // Pass full artist data including IDs
        topGenres
      );
      
      console.log('Recommended artists found:', recommendedArtists.length);
      console.log('Sample recommendations:', recommendedArtists.slice(0, 3).map(a => ({ 
        name: a.name, 
        genres: a.genres?.slice(0, 2), 
        popularity: a.popularity 
      })));

      // Process recommended artists
      const processedRecommendations = recommendedArtists.map(artist => ({
        id: artist.id,
        name: artist.name || "Unknown Artist",
        genres: artist.genres || [],
        image: artist.images?.[0]?.url || '', // Should now have images
        spotifyUrl: artist.external_urls?.spotify || '#',
        popularity: artist.popularity ?? 0,
      }));

      // Split recommendations into popular and underrated based on popularity
      const sortedRecommendations = [...processedRecommendations].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      const popular_recommendations = sortedRecommendations.slice(0, Math.ceil(sortedRecommendations.length / 2));
      const underrated_recommendations = sortedRecommendations.slice(Math.ceil(sortedRecommendations.length / 2));

      // Generate a more detailed taste profile
      const avgPopularity = Math.round(validArtists.reduce((sum, a) => sum + (a.popularity || 0), 0) / validArtists.length);
      const taste_profile = topGenres.length > 0 
        ? `Your taste centers around ${topGenres.slice(0, 3).join(', ')} with ${avgPopularity > 70 ? 'mainstream' : avgPopularity > 40 ? 'moderately popular' : 'underground/indie'} preferences.`
        : 'Your taste profile is diverse and eclectic!';

      const results: AnalysisResult = {
        language,
        artists_analyzed: validArtists.length,
        artist_data: validArtists,
        genre_distribution: genreDistribution,
        dominant_genres: topGenres,
        taste_profile,
        underrated_recommendations,
        popular_recommendations,
        total_genres_found: Object.keys(genreCounts).length,
      };

      console.log('Analysis complete:', results);
      setResults(results);
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('An error occurred during analysis. Please check the console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MusicScope</h1>
                <p className="text-xs text-white/70">Discover Your Musical DNA</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setDialogOpen('analyze')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Analyze
              </button>
              <button
                onClick={() => setDialogOpen('discover')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Discover
              </button>
              <button
                onClick={() => setDialogOpen('about')}
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Decode Your
                <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent"> Musical Soul</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Discover the hidden patterns in your music taste. Get personalized insights, 
                find your musical DNA, and uncover artists you'll love.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">AI-Powered Analysis</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Personalized Insights</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-white text-sm">Discover New Music</span>
                </div>
              </div>
            </div>
            
            {/* Animated Music Visualization */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="w-60 h-60 rounded-full bg-gradient-to-r from-pink-500/30 to-violet-500/30 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center animate-pulse">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10">
        {!results ? (
          <MusicForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
        ) : (
          <ResultsDisplay results={results} onReset={() => setResults(null)} />
        )}
      </main>

      {/* Loading Overlay */}
      {isAnalyzing && <LoadingOverlay />}

      {/* Dialogs for About, Analyze, Discover sections */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setDialogOpen(null)}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <div>
              {dialogOpen === 'about' && <AboutSection />}
              {dialogOpen === 'analyze' && <AnalyzeSection />}
              {dialogOpen === 'discover' && <DiscoverSection />}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/60">
              © 2025 MusicScope. Discover your musical universe.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;