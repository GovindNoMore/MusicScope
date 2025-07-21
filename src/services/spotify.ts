import axios from 'axios';

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export async function getSpotifyToken(): Promise<string> {
  try {
    // Debug logging to check credentials
    console.log('Spotify Client ID:', SPOTIFY_CLIENT_ID ? 'Set (length: ' + SPOTIFY_CLIENT_ID.length + ')' : 'NOT SET');
    console.log('Spotify Client Secret:', SPOTIFY_CLIENT_SECRET ? 'Set (length: ' + SPOTIFY_CLIENT_SECRET.length + ')' : 'NOT SET');
    
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials are not configured. Check your .env file.');
    }

    // Check if credentials look valid (basic format check)
    if (SPOTIFY_CLIENT_ID.length < 30) {
      console.warn('Client ID seems too short. Make sure you copied the full Client ID from Spotify Dashboard.');
    }
    if (SPOTIFY_CLIENT_SECRET.length < 30) {
      console.warn('Client Secret seems too short. Make sure you copied the full Client Secret from Spotify Dashboard.');
    }

    // Proper base64 encoding for browser and Node
    let credentials: string;
    if (typeof window === 'undefined') {
      credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    } else {
      credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    }

    console.log('Making request to Spotify token endpoint...');
    
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const data = response.data as { access_token?: string };
    if (!data.access_token) {
      throw new Error('No access token received from Spotify');
    }

    console.log('Successfully received Spotify token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    // Check if error is an AxiosError
    if ((error as any).isAxiosError && (error as any).response) {
      const response = (error as any).response;
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response Data:', response.data);
      
      if (response.status === 400) {
        console.error('🚨 400 Bad Request - This usually means:');
        console.error('1. Invalid Client ID or Client Secret');
        console.error('2. Credentials are not properly encoded');
        console.error('3. Missing or malformed Authorization header');
        console.error('Please double-check your Spotify app credentials in the Developer Dashboard');
      }
    }
    throw error;
  }
}

export async function searchArtist(name: string, token: string): Promise<SpotifyArtist | null> {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: name,
        type: 'artist',
        limit: 1
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data as {
      artists: {
        items: SpotifyArtist[];
      };
    };

    return data.artists.items[0] || null;
  } catch (error) {
    console.error('Error searching artist:', error);
    return null;
  }
}

export async function getRelatedArtists(artistId: string, token: string) {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data as { artists: SpotifyArtist[] };
    return data.artists || [];
  } catch (error) {
    console.error('Error fetching related artists:', error);
    return [];
  }
}

export async function testSpotifyConnection() {
  try {
    console.log('🔍 Testing Spotify API connection...');
    console.log('Getting Spotify token...');
    const token = await getSpotifyToken();
    console.log('✅ Token received successfully');

    console.log('Searching for test artist...');
    const artist = await searchArtist('Taylor Swift', token);
    console.log('✅ Spotify API Test Result:', {
      name: artist?.name,
      genres: artist?.genres,
      imageUrl: artist?.images[0]?.url,
      spotifyUrl: artist?.external_urls.spotify
    });
    return true;
  } catch (error) {
    console.error('❌ Spotify API Test Failed:', error);
    return false;
  }
}