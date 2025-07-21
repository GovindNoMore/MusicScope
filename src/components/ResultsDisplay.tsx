import React from 'react';
import type { AnalysisResult } from '../types/music'; // Use type-only import
import { 
  Music, 
  TrendingUp, 
  Sparkles, 
  RotateCcw,
  Star,
  Heart,
  Zap
} from 'lucide-react';

interface ResultsDisplayProps {
  results: AnalysisResult;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset }) => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Your Musical DNA Decoded
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Here's what your music taste reveals about you
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">{results.artists_analyzed}</div>
              <div className="text-white/60">Artists Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-400">{results.total_genres_found}</div>
              <div className="text-white/60">Genres Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{results.language}</div>
              <div className="text-white/60">Language</div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Different Artists</span>
          </button>
        </div>

        <div className="grid gap-8">
          {/* Taste Profile */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Your Musical Personality</h3>
              </div>
              <div className="inline-block bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-xl px-8 py-4 rounded-2xl">
                {results.taste_profile}
              </div>
            </div>
          </div>

          {/* Your Artists */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Music className="w-6 h-6 text-pink-400" />
              <h3 className="text-2xl font-bold text-white">Your Artists</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.artist_data.map((artist, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                  <img
                    src={artist.image || '/fallback.png'}
                    alt={artist.name}
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                  <h4 className="font-semibold text-white mb-2">
                    <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                      {artist.name}
                    </a>
                  </h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {artist.genres.slice(0, 3).map((genre, genreIndex) => (
                      <span
                        key={genreIndex}
                        className="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-white/80 text-xs rounded-full border border-white/20"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genre Analysis */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Dominant Genres */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Dominant Genres</h3>
              </div>
              <div className="space-y-3">
                {results.dominant_genres.slice(0, 5).map((genre, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10"
                  >
                    <span className="text-white font-medium">{genre}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-1000"
                          style={{ width: `${100 - index * 15}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-sm">{100 - index * 15}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Genre Breakdown</h3>
              </div>
              <div className="space-y-4">
                {results.genre_distribution.slice(0, 6).map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{item.genre}</span>
                      <span className="text-white/60">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${item.percentage}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Underrated Recommendations */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Hidden Gems</h3>
              </div>
              <p className="text-white/70 mb-6">Underrated artists you might love</p>
              <div className="grid grid-cols-2 gap-4">
                {results.underrated_recommendations.map((artist, index) => (
                  <a
                    key={artist.spotifyUrl || index}
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-yellow-400/50 block"
                  >
                    <img
                      src={artist.image || '/fallback.png'}
                      alt={artist.name}
                      className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                    />
                    <h4 className="font-medium text-white text-sm">{artist.name}</h4>
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {artist.genres?.slice(0, 3).map((genre) => (
                        <span key={genre} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">{genre}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Popular Recommendations */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-bold text-white">Crowd Favorites</h3>
              </div>
              <p className="text-white/70 mb-6">Popular artists in your genres</p>
              <div className="grid grid-cols-2 gap-4">
                {results.popular_recommendations.map((artist, index) => (
                  <a
                    key={index}
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-green-400/50"
                  >
                    <img
                      src={artist.image || '/fallback.png'}
                      alt={artist.name}
                      className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                    />
                    <h4 className="font-medium text-white text-sm">{artist.name}</h4>
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {artist.genres.slice(0, 3).map((genre) => (
                        <span key={genre} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">{genre}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;