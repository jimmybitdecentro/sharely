import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { youtubeService, YouTubeChannel, YouTubeVideo } from '../../services/api/youtubeService';
import { ChannelCard, StatCard, VideoItem } from '../../components/youtube/YouTubeComponents';
import { lightTheme as theme } from '../../theme';
import { googleAuthService } from '../../services/auth/googleAuthService';
import Container from '../../components/layouts/Container/Container';
import Label from '../../components/base/Label/Label';
import Button from '../../components/base/Button/Button';
import { ActionBar } from '../../components/common/Headers/ActionBar';
import WhiteCard from '../../components/common/WhiteCard/WhiteCard';
import { s } from '../../theme/size';

const YouTubeMetricsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGoogleSignedIn, setIsGoogleSignedIn] = useState<boolean | null>(null);
    const [channel, setChannel] = useState<YouTubeChannel | null>(null);
    const [recentVideos, setRecentVideos] = useState<YouTubeVideo[]>([]);
    const [likedVideos, setLikedVideos] = useState<YouTubeVideo[]>([]);

    const checkGoogleAuth = useCallback(async () => {
        await googleAuthService.initialize();
        const signedIn = await googleAuthService.isSignedIn();
        setIsGoogleSignedIn(signedIn);
        return signedIn;
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const signedIn = await checkGoogleAuth();
            if (!signedIn) {
                setLoading(false);
                return;
            }

            const [channelData, recentData, likedData] = await Promise.all([
                youtubeService.getChannelDetails(),
                youtubeService.getRecentVideos(),
                youtubeService.getLikedVideos(),
            ]);
            setChannel(channelData);
            setRecentVideos(recentData);
            setLikedVideos(likedData);
        } catch (err: any) {
            setError(err.message || 'Failed to load YouTube metrics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [checkGoogleAuth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await googleAuthService.signIn();
            await fetchData();
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container style={styles.center}>
                <ActivityIndicator size="large" color="#23C28C" />
                <Label text="Loading YouTube metrics..." size={16} color="#FFFFFF" style={{ marginTop: s(12) }} />
            </Container>
        );
    }

    if (isGoogleSignedIn === false) {
        return (
            <Container>
                <ActionBar title="YouTube Metrics" onBackPress={() => navigation.goBack()} />
                <View style={styles.center}>
                    <Label text="Sign in with Google to view your YouTube metrics" size={16} color="#FFFFFF" style={styles.message} />
                    <Button title="Sign in with Google" onPress={handleGoogleSignIn} style={styles.button} />
                </View>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ActionBar title="YouTube Metrics" onBackPress={() => navigation.goBack()} />
                <View style={styles.center}>
                    <Label text={error} size={16} color="#FFCDD2" style={styles.message} />
                    <Button title="Retry" onPress={() => { setLoading(true); fetchData(); }} style={styles.button} />
                </View>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <ActionBar title="YouTube Metrics" onBackPress={() => navigation.goBack()} />

            <WhiteCard marginTop={12} style={styles.whiteCard}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#23C28C']}
                            tintColor="#23C28C"
                        />
                    }
                >
                    {channel && (
                        <>
                            <ChannelCard channel={channel} />

                            <View style={styles.divider} />

                            <View style={styles.statsRow}>
                                <StatCard label="Subscribers" value={channel.statistics.subscriberCount} color="#23C28C" />
                                <StatCard label="Videos" value={channel.statistics.videoCount} color="#1A1A1A" />
                                <StatCard label="Total Views" value={channel.statistics.viewCount} color="#1A1A1A" />
                            </View>
                        </>
                    )}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Label text="Recent Videos" size={18} weight="bold" color="#1A1A1A" />
                        </View>
                        {recentVideos.length > 0 ? (
                            recentVideos.map((video) => <VideoItem key={video.id} video={video} />)
                        ) : (
                            <Label text="No recent videos found." size={14} color="#888888" style={styles.emptyText} />
                        )}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Label text="Liked Videos" size={18} weight="bold" color="#1A1A1A" />
                        </View>
                        {likedVideos.length > 0 ? (
                            likedVideos.map((video) => <VideoItem key={video.id} video={video} />)
                        ) : (
                            <Label text="No liked videos found." size={14} color="#888888" style={styles.emptyText} />
                        )}
                    </View>
                </ScrollView>
            </WhiteCard>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: s(16),
        paddingTop: s(16),
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: s(20),
    },
    message: {
        textAlign: 'center',
        marginBottom: s(24),
    },
    button: {
        width: '80%',
    },
    whiteCard: {
        marginBottom: 0,
        marginHorizontal: s(-16), // Offset container padding
    },
    scrollContent: {
        paddingBottom: s(40),
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: s(16),
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: s(24),
    },
    section: {
        marginTop: s(8),
        marginBottom: s(24),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: s(16),
    },
    emptyText: {
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: s(10),
    },
});

export default YouTubeMetricsScreen;
