import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import {Button} from '@/components/UI/Button';
import {useCurrentUser} from '@/hooks/user/useCurrentUser';
import {useTheme} from '@/theme/ThemeProvider';

export const HomeScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const me = useCurrentUser();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: palette.background, padding: spacing.lg},
      ]}>
      <Text style={[typography.h1, {color: palette.text}]}>
        {t('screens.home')}
      </Text>
      {me.isPending ? (
        <Text
          style={[
            typography.body,
            {color: palette.textMuted, marginTop: spacing.sm},
          ]}>
          {t('common.loading')}
        </Text>
      ) : me.isError ? (
        <View style={{marginTop: spacing.sm}}>
          <Text
            style={[
              typography.body,
              {color: palette.error, marginBottom: spacing.sm},
            ]}>
            {t('home.profileLoadFailed')}
          </Text>
          <Button
            title={t('common.retry')}
            onPress={() => me.refetch()}
            variant="secondary"
          />
        </View>
      ) : (
        <Text
          style={[
            typography.body,
            {color: palette.textMuted, marginTop: spacing.sm},
          ]}>
          {me.data?.email ?? me.data?.id}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
