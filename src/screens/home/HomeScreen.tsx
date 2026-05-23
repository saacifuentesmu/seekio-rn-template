import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import {useTheme} from '@/theme/ThemeProvider';

export const HomeScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: palette.background, padding: spacing.lg}]}>
      <Text style={[typography.h1, {color: palette.text}]}>{t('screens.home')}</Text>
      <Text style={[typography.body, {color: palette.textMuted, marginTop: spacing.sm}]}>{t('appName')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
