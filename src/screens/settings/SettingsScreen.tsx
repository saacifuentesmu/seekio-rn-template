import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {Button} from '@/components/UI/Button';
import {useAuth} from '@/hooks/auth/useAuth';
import {useSettingsStore} from '@/store/settingsStore';
import {PaletteName, palettes} from '@/theme/palette';
import {useTheme} from '@/theme/ThemeProvider';

type ThemeMode = 'light' | 'dark' | 'system';

const PALETTE_NAMES: PaletteName[] = ['default', 'forest', 'slate'];
const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];

export const SettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const {user, signOut} = useAuth();
  const paletteName = useSettingsStore(s => s.paletteName);
  const themeMode = useSettingsStore(s => s.themeMode);
  const setPaletteName = useSettingsStore(s => s.setPaletteName);
  const setThemeMode = useSettingsStore(s => s.setThemeMode);

  const paletteLabel = (name: PaletteName): string => {
    if (name === 'default') return t('settings.paletteDefault');
    if (name === 'forest') return t('settings.paletteForest');
    return t('settings.paletteSlate');
  };

  const themeLabel = (mode: ThemeMode): string => {
    if (mode === 'light') return t('settings.themeLight');
    if (mode === 'dark') return t('settings.themeDark');
    return t('settings.themeSystem');
  };

  return (
    <ScrollView
      style={{backgroundColor: palette.background}}
      contentContainerStyle={[styles.container, {padding: spacing.lg}]}>
      <Text style={[typography.h1, {color: palette.text}]}>{t('screens.settings')}</Text>
      {user ? (
        <Text style={[typography.body, {color: palette.textMuted, marginTop: spacing.sm}]}>
          {user.email ?? user.id}
        </Text>
      ) : null}

      <Text style={[typography.h2, {color: palette.text, marginTop: spacing.xl}]}>{t('settings.appearance')}</Text>

      <Text style={[typography.caption, {color: palette.textMuted, marginTop: spacing.md, marginBottom: spacing.sm}]}>
        {t('settings.palette')}
      </Text>
      <View>
        {PALETTE_NAMES.map(name => {
          const selected = name === paletteName;
          const preview = palettes[name].light.primary;
          return (
            <Pressable
              key={name}
              onPress={() => setPaletteName(name)}
              style={[
                styles.row,
                {
                  borderColor: selected ? palette.primary : palette.border,
                  backgroundColor: palette.surface,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}>
              <View style={[styles.swatch, {backgroundColor: preview, marginRight: spacing.md}]} />
              <Text style={[typography.body, {color: palette.text, flex: 1}]}>{paletteLabel(name)}</Text>
              {selected ? <Text style={[typography.body, {color: palette.primary}]}>{'✓'}</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <Text style={[typography.caption, {color: palette.textMuted, marginTop: spacing.md, marginBottom: spacing.sm}]}>
        {t('settings.themeMode')}
      </Text>
      <View style={[styles.segment, {borderColor: palette.border}]}>
        {THEME_MODES.map(mode => {
          const selected = mode === themeMode;
          return (
            <Pressable
              key={mode}
              onPress={() => setThemeMode(mode)}
              style={[
                styles.segmentItem,
                {
                  paddingVertical: spacing.md,
                  backgroundColor: selected ? palette.primary : 'transparent',
                },
              ]}>
              <Text
                style={[
                  typography.body,
                  {color: selected ? '#fff' : palette.text, textAlign: 'center'},
                ]}>
                {themeLabel(mode)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        title={t('common.signOut')}
        onPress={signOut}
        variant="secondary"
        style={{marginTop: spacing.xl}}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  swatch: {width: 24, height: 24, borderRadius: 12},
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentItem: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
