import React from 'react';
import {StyleSheet, Text, TextInput as RNTextInput, TextInputProps, View} from 'react-native';

import {useTheme} from '@/theme/ThemeProvider';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextInput: React.FC<Props> = ({label, error, style, ...rest}) => {
  const {palette, spacing, typography} = useTheme();
  return (
    <View style={{marginBottom: spacing.md}}>
      {label ? <Text style={[typography.caption, {color: palette.textMuted, marginBottom: spacing.xs}]}>{label}</Text> : null}
      <RNTextInput
        placeholderTextColor={palette.textMuted}
        style={[
          styles.input,
          {
            borderColor: error ? palette.error : palette.border,
            color: palette.text,
            padding: spacing.md,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={[typography.caption, {color: palette.error, marginTop: spacing.xs}]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {borderWidth: 1, borderRadius: 8, fontSize: 16},
});
