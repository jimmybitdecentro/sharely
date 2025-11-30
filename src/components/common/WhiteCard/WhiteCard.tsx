import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { s } from '../../../theme/size';

interface WhiteCardProps {
  children: React.ReactNode;
  topBorderRadius?: number;
  bottomBorderRadius?: number;
  padding?: number | { horizontal?: number; vertical?: number; top?: number; bottom?: number };
  marginTop?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const WhiteCard: React.FC<WhiteCardProps> = ({
  children,
  topBorderRadius = 30,
  bottomBorderRadius,
  padding = { horizontal: 16, top: 24 },
  marginTop = 12,
  style,
  contentContainerStyle,
}) => {
  const styles = createStyles(
    topBorderRadius,
    bottomBorderRadius,
    padding,
    marginTop
  );

  return (
    <View style={[styles.whiteCard, style]}>
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
};

const createStyles = (
  topBorderRadius: number,
  bottomBorderRadius: number | undefined,
  padding: number | { horizontal?: number; vertical?: number; top?: number; bottom?: number },
  marginTop: number
) => {
  const paddingHorizontal =
    typeof padding === 'number' ? padding : padding.horizontal || 16;
  const paddingVertical =
    typeof padding === 'number' ? padding : padding.vertical;
  const paddingTop =
    typeof padding === 'number' ? undefined : padding.top || 24;
  const paddingBottom =
    typeof padding === 'number' ? undefined : padding.bottom;

  return StyleSheet.create({
    whiteCard: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: s(topBorderRadius),
      borderTopRightRadius: s(topBorderRadius),
      ...(bottomBorderRadius !== undefined && {
        borderBottomLeftRadius: s(bottomBorderRadius),
        borderBottomRightRadius: s(bottomBorderRadius),
      }),
      marginTop: s(marginTop),
    },
    content: {
      flex: 1,
      paddingHorizontal: paddingHorizontal ? s(paddingHorizontal) : undefined,
      paddingVertical: paddingVertical ? s(paddingVertical) : undefined,
      paddingTop: paddingTop ? s(paddingTop) : undefined,
      paddingBottom: paddingBottom ? s(paddingBottom) : undefined,
    },
  });
};

export default WhiteCard;

