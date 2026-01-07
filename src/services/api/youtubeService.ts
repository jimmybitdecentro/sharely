import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface YouTubeChannel {
    id: string;
    title: string;
    customUrl: string;
    description: string;
    thumbnail: string;
    statistics: {
        subscriberCount: string;
        videoCount: string;
        viewCount: string;
    };
}

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
    };
}

class YouTubeService {
    private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
    private tokenPromise: Promise<string> | null = null;

    private async getAccessToken(): Promise<string> {
        if (this.tokenPromise) {
            return this.tokenPromise;
        }

        this.tokenPromise = (async () => {
            try {
                const { accessToken } = await GoogleSignin.getTokens();
                if (!accessToken) {
                    throw new Error('No access token found. Please re-authenticate.');
                }
                return accessToken;
            } finally {
                this.tokenPromise = null;
            }
        })();

        return this.tokenPromise;
    }

    async getChannelDetails(): Promise<YouTubeChannel> {
        const token = await this.getAccessToken();
        const response = await fetch(
            `${this.BASE_URL}/channels?part=snippet,statistics&mine=true`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error('No YouTube channel found for this account.');
        }

        const item = data.items[0];
        return {
            id: item.id,
            title: item.snippet.title,
            customUrl: item.snippet.customUrl,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            statistics: item.statistics,
        };
    }

    async getRecentVideos(maxResults = 10): Promise<YouTubeVideo[]> {
        const token = await this.getAccessToken();

        // 1. Get recent video IDs
        const searchResponse = await fetch(
            `${this.BASE_URL}/search?part=snippet&mine=true&order=date&type=video&maxResults=${maxResults}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
            return [];
        }

        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

        // 2. Get detailed stats for those videos
        const videoResponse = await fetch(
            `${this.BASE_URL}/videos?part=snippet,statistics&id=${videoIds}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const videoData = await videoResponse.json();

        return videoData.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt,
            statistics: item.statistics,
        }));
    }

    async getLikedVideos(maxResults = 10): Promise<YouTubeVideo[]> {
        const token = await this.getAccessToken();
        const response = await fetch(
            `${this.BASE_URL}/videos?part=snippet,statistics&myRating=like&maxResults=${maxResults}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const data = await response.json();
        if (!data.items) return [];

        return data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt,
            statistics: item.statistics,
        }));
    }
}

export const youtubeService = new YouTubeService();
