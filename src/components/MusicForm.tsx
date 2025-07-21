import React, { useState } from 'react';
import { Music, Globe, Sparkles, ArrowRight } from 'lucide-react';

interface MusicFormProps {
  onAnalyze: (language: string, artists: string[]) => void;
  isAnalyzing: boolean;
}

const MusicForm: React.FC<MusicFormProps> = ({ onAnalyze, isAnalyzing }) => {
  const [language, setLanguage] = useState('');
  const [artistsInput, setArtistsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const artists = artistsInput
      .split(',')
      .map(artist => artist.trim())
      .filter(artist => artist.length > 0);

    if (artists.length === 0) {
      alert('Please enter at least one artist!');
      return;
    }

    if (artists.length > 20) {
      alert('Please limit your selection to 20 artists maximum.');
      return;
    }

    onAnalyze(language, artists);
  };

  const addExampleArtist = (artist: string) => {
    const current = artistsInput.trim();
    const newValue = current ? `${current}, ${artist}` : artist;
    setArtistsInput(newValue);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Let's Analyze Your Music Taste
            </h2>
            <p className="text-white/80 text-lg">
              Tell us about your favorite artists and we'll reveal your musical personality
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Language Input */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-medium">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Preferred Language (Optional)</span>
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., English, Spanish, Korean..."
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              />
              <p className="text-white/60 text-sm flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>This helps us find recommendations in your preferred language</span>
              </p>
            </div>

            {/* Artists Input */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-medium">
                <Music className="w-5 h-5 text-pink-400" />
                <span>Your Favorite Artists</span>
              </label>
              <textarea
                value={artistsInput}
                onChange={(e) => setArtistsInput(e.target.value)}
                placeholder="e.g., Radiohead, Taylor Swift, Kendrick Lamar, Phoebe Bridgers..."
                rows={4}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
                required
              />
              <p className="text-white/60 text-sm flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>Separate artists with commas. The more you add, the better your analysis!</span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 group"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Your Taste...</span>
                </>
              ) : (
                <>
                  <span>Analyze My Music Taste</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Example Artists */}
          <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <h3 className="text-white font-medium mb-3">Need inspiration? Try these:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Radiohead', 'Taylor Swift', 'Kendrick Lamar', 'Phoebe Bridgers',
                'Arctic Monkeys', 'Billie Eilish', 'Tame Impala', 'Frank Ocean',
                'Bon Iver', 'Tyler The Creator', 'Clairo', 'Mac Miller'
              ].map((artist) => (
                <button
                  key={artist}
                  type="button"
                  onClick={() => addExampleArtist(artist)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm rounded-full transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  {artist}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicForm;