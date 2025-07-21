import React, { useState } from 'react';
import { Music, Sparkles, TrendingUp, Heart, Zap, Globe } from 'lucide-react';
import type { AnalysisResult } from './types/music'; 
import MusicForm from './components/MusicForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingOverlay from './components/LoadingOverlay';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleAnalysis = async (language: string, artists: string[]) => {
    setIsAnalyzing(true);
    
    // Simulate realistic analysis with proper delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate realistic mock results
    const genreDatabase: { [key: string]: string[] } = {
      'radiohead': ['alternative', 'rock', 'experimental', 'electronic'],
      'kendrick lamar': ['hip-hop', 'conscious rap', 'experimental', 'jazz'],
      'tame impala': ['psychedelic', 'indie', 'electronic', 'rock'],
      'phoebe bridgers': ['indie', 'folk', 'alternative', 'singer-songwriter'],
      'taylor swift': ['pop', 'country', 'folk', 'alternative'],
      'drake': ['hip-hop', 'r&b', 'pop', 'trap'],
      'billie eilish': ['pop', 'alternative', 'electropop', 'indie'],
      'arctic monkeys': ['indie', 'rock', 'alternative', 'garage rock'],
      'frank ocean': ['r&b', 'hip-hop', 'experimental', 'soul'],
      'bon iver': ['indie', 'folk', 'experimental', 'ambient'],
      'the beatles': ['rock', 'pop', 'psychedelic', 'classic rock'],
      'kanye west': ['hip-hop', 'experimental', 'electronic', 'gospel'],
      'lorde': ['pop', 'indie', 'electropop', 'alternative'],
      'mac miller': ['hip-hop', 'alternative', 'jazz', 'soul'],
      'clairo': ['indie', 'pop', 'bedroom pop', 'lo-fi'],
      'tyler the creator': ['hip-hop', 'experimental', 'alternative', 'r&b'],
      'vampire weekend': ['indie', 'pop', 'alternative', 'afrobeat'],
      'car seat headrest': ['indie', 'rock', 'alternative', 'lo-fi'],
      'beach house': ['dream pop', 'shoegaze', 'indie', 'ambient'],
      'grimes': ['electronic', 'experimental', 'pop', 'synth-pop']
    };

    // Generate artist data with genres
    const artistData = artists.map(artist => {
      const normalizedName = artist.toLowerCase().trim();
      const genres = genreDatabase[normalizedName] || ['indie', 'alternative', 'rock'];
      
      return {
        name: artist,
        genres: genres.slice(0, 3),
        image: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`
      };
    });

    // Calculate genre distribution
    const allGenres: string[] = [];
    artistData.forEach(artist => allGenres.push(...artist.genres));
    
    const genreCounts: { [key: string]: number } = {};
    allGenres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    const totalGenres = allGenres.length;
    const genreDistribution = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([genre, count]) => ({
        genre: genre.charAt(0).toUpperCase() + genre.slice(1),
        count,
        percentage: Math.round((count / totalGenres) * 100)
      }));

    const dominantGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre.charAt(0).toUpperCase() + genre.slice(1));

    // Generate taste profile
    const hasExperimental = allGenres.some(g => ['experimental', 'ambient', 'electronic'].includes(g));
    const hasIndie = allGenres.some(g => ['indie', 'alternative', 'folk'].includes(g));
    const hasMainstream = allGenres.some(g => ['pop', 'rock', 'hip-hop'].includes(g));
    
    let tasteProfile = '';
    if (hasExperimental) {
      tasteProfile = '🔬 EXPERIMENTAL EXPLORER: You actively seek boundary-pushing, avant-garde music!';
    } else if (hasIndie && !hasMainstream) {
      tasteProfile = '🎸 INDIE CONNOISSEUR: You have refined taste for independent, alternative music!';
    } else if (hasMainstream) {
      tasteProfile = '🌟 CULTURAL CONNECTOR: You appreciate widely-loved, influential music!';
    } else {
      tasteProfile = '🎵 ECLECTIC CURATOR: You have beautifully diverse musical taste!';
    }

    // Generate recommendations
    const underratedRecs = [
      'Phoebe Bridgers', 'Big Thief', 'Car Seat Headrest', 'Clairo',
      'Black Midi', 'Fontaines D.C.', 'Little Simz', 'JPEGMAFIA'
    ].slice(0, 6).map(name => ({
      name,
      image: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`
    }));

    const popularRecs = [
      'Arctic Monkeys', 'The Strokes', 'Vampire Weekend', 'Tame Impala',
      'Radiohead', 'Kendrick Lamar'
    ].slice(0, 6).map(name => ({
      name,
      image: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`
    }));

    const mockResults: AnalysisResult = {
      language: language || 'Any',
      artists_analyzed: artists.length,
      artist_data: artistData,
      genre_distribution: genreDistribution,
      dominant_genres: dominantGenres,
      taste_profile: tasteProfile,
      underrated_recommendations: underratedRecs,
      popular_recommendations: popularRecs,
      total_genres_found: Object.keys(genreCounts).length
    };
    
    setResults(mockResults);
    setIsAnalyzing(false);
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
              <a href="#analyze" className="text-white/80 hover:text-white transition-colors">Analyze</a>
              <a href="#discover" className="text-white/80 hover:text-white transition-colors">Discover</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
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