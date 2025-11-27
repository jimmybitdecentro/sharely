import React from 'react';
import { Text, TextStyle, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
    text: string;
    style?: TextStyle;
    colors?: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
}

const GradientText: React.FC<GradientTextProps> = ({
    text,
    style,
    colors = ['#2C73D2', '#1A88B3', '#23C28C'], // Default colors from design
    start = { x: 0, y: 0 },
    end = { x: 1, y: 0 },
}) => {
    return (
        <MaskedView
            maskElement={
                <Text style={[style, { backgroundColor: 'transparent' }]}>
                    {text}
                </Text>
            }
        >
            <LinearGradient
                colors={colors}
                start={start}
                end={end}
            >
                <Text style={[style, { opacity: 0 }]}>
                    {text}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;
