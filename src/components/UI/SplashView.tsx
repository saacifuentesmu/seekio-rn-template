import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import {useTheme} from '@/theme/ThemeProvider';

export const SplashView: React.FC = () => {
  const {t} = useTranslation();
  const {palette, typography} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: palette.background}]}>
      <Text style={[typography.h1, {color: palette.text}]}>{t('appName')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
