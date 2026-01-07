import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { YouTubeChannel, YouTubeVideo } from '../../services/api/youtubeService';
import { formatNumber, formatRelativeDate } from '../../utils/formatters';
import { lightTheme as theme } from '../../theme';
import Label from '../base/Label/Label';
import { s } from '../../theme/size';
import { images } from '../../theme/images';

export const ChannelCard: React.FC<{ channel: YouTubeChannel }> = ({ channel }) => (
    <View style={styles.channelCard}>
        <View style={styles.channelHeader}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: channel.thumbnail }} style={styles.avatar} />
            </View>
            <View style={styles.channelInfo}>
                <Label text={channel.title} size={20} weight="bold" color="#1A1A1A" />
                <Label text={channel.customUrl} size={14} color="#666666" style={{ marginTop: s(2) }} />
            </View>
        </View>
    </View>
);

export const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "#1A1A1A" }) => (
    <View style={styles.statItem}>
        <Label text={label} size={12} color="#888888" />
        <Label text={formatNumber(value)} size={20} weight="bold" color={color} />
    </View>
);

export const VideoItem: React.FC<{ video: YouTubeVideo }> = ({ video }) => {
    const handleWatch = () => {
        Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`);
    };

    return (
        <TouchableOpacity style={styles.videoItem} onPress={handleWatch} activeOpacity={0.7}>
            <View style={styles.videoLeft}>
                <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                </View>
                <View style={styles.videoDetails}>
                    <Label
                        text={video.title}
                        size={15}
                        weight="medium"
                        color="#1A1A1A"
                        numberOfLines={1}
                    />
                    <Label
                        text={`${formatNumber(video.statistics.viewCount)} views • ${formatRelativeDate(video.publishedAt)}`}
                        size={12}
                        color="#888888"
                        style={styles.videoMeta}
                    />
                </View>
            </View>
            <Image source={images.rightArrow} style={styles.arrowIcon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    channelCard: {
        marginBottom: s(16),
    },
    channelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    avatarContainer: {
        width: s(60),
        height: s(60),
        borderRadius: s(30),
        backgroundColor: '#F5F5F5',
        marginRight: s(16),
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    channelInfo: {
        flex: 1,
    },
    statItem: {
        alignItems: 'flex-start',
        flex: 1,
    },
    videoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: s(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    videoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    thumbnailContainer: {
        width: s(44),
        height: s(44),
        borderRadius: s(10),
        backgroundColor: '#F5F5F5',
        marginRight: s(12),
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    videoDetails: {
        flex: 1,
    },
    videoMeta: {
        marginTop: s(2),
    },
    arrowIcon: {
        width: s(16),
        height: s(8),
        resizeMode: 'contain',
        tintColor: '#CCC',
    },
});
