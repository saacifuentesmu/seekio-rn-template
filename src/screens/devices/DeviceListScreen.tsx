import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

import {Button} from '@/components/UI/Button';
import {useBleScan} from '@/hooks/ble/useBleScan';
import {DevicesStackParamList} from '@/navigation/types';
import {useTheme} from '@/theme/ThemeProvider';

export const DeviceListScreen: React.FC = () => {
  const {t} = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<DevicesStackParamList, 'DeviceList'>>();
  const {palette, spacing, typography} = useTheme();
  const {scanning, devices, error, start, stop} = useBleScan();

  return (
    <View style={[styles.container, {backgroundColor: palette.background, padding: spacing.lg}]}>
      <Button
        title={scanning ? t('devices.stopScan') : t('devices.startScan')}
        onPress={scanning ? stop : start}
        variant={scanning ? 'secondary' : 'primary'}
      />
      {error ? <Text style={{color: palette.error, marginTop: spacing.sm}}>{error}</Text> : null}
      <FlatList
        style={{marginTop: spacing.md}}
        data={devices}
        keyExtractor={d => d.id}
        ListEmptyComponent={
          <Text style={[typography.body, {color: palette.textMuted, textAlign: 'center', marginTop: spacing.lg}]}>
            {scanning ? t('devices.scanning') : t('devices.empty')}
          </Text>
        }
        renderItem={({item}) => (
          <Pressable
            onPress={() => nav.navigate('DeviceDetail', {deviceId: item.id})}
            style={[styles.row, {borderColor: palette.border, padding: spacing.md}]}>
            <Text style={[typography.body, {color: palette.text}]}>{item.name ?? 'Unnamed'}</Text>
            <Text style={[typography.caption, {color: palette.textMuted}]}>{item.id}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  row: {borderBottomWidth: 1, borderRadius: 6},
});
