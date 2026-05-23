import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import {Button} from '@/components/UI/Button';
import {useAuth} from '@/hooks/auth/useAuth';
import {useTheme} from '@/theme/ThemeProvider';

export const SettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const {user, signOut} = useAuth();

  return (
    <View style={[styles.container, {backgroundColor: palette.background, padding: spacing.lg}]}>
      <Text style={[typography.h1, {color: palette.text}]}>{t('screens.settings')}</Text>
      {user ? (
        <Text style={[typography.body, {color: palette.textMuted, marginTop: spacing.sm}]}>{user.email ?? user.id}</Text>
      ) : null}
      <Button title={t('common.signOut')} onPress={signOut} variant="secondary" style={{marginTop: spacing.lg}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
