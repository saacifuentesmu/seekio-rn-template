import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Button} from '@/components/UI/Button';
import {useBleDevice} from '@/hooks/ble/useBleDevice';
import {DevicesStackParamList} from '@/navigation/types';
import {useTheme} from '@/theme/ThemeProvider';

export const DeviceDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<DevicesStackParamList, 'DeviceDetail'>>();
  const {deviceId} = route.params;
  const {palette, spacing, typography} = useTheme();
  const {connected, error, connect, disconnect} = useBleDevice(deviceId);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: palette.background, padding: spacing.lg},
      ]}>
      <Text style={[typography.h2, {color: palette.text}]}>{deviceId}</Text>
      <Text
        style={[
          typography.body,
          {color: palette.textMuted, marginTop: spacing.sm},
        ]}>
        {connected ? 'Connected' : 'Connecting…'}
      </Text>
      {error ? (
        <Text style={{color: palette.error, marginTop: spacing.sm}}>
          {error}
        </Text>
      ) : null}
      <Button
        title="Disconnect"
        onPress={disconnect}
        variant="secondary"
        style={{marginTop: spacing.lg}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
