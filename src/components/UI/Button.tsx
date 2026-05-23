import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle} from 'react-native';

import {useTheme} from '@/theme/ThemeProvider';

interface Props {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({title, onPress, loading, disabled, variant = 'primary', style}) => {
  const {palette, spacing, typography} = useTheme();
  const isDisabled = disabled || loading;
  const bg = variant === 'primary' ? palette.primary : palette.surface;
  const fg = variant === 'primary' ? '#fff' : palette.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {backgroundColor: bg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, opacity: isDisabled ? 0.5 : 1},
        style,
      ]}>
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[typography.button, {color: fg}]}>{title}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
});
