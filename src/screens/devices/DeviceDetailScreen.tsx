import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {Button} from '@/components/UI/Button';
import {useBleDevice} from '@/hooks/ble/useBleDevice';
import {useDeviceAdvertisements} from '@/hooks/devices/useDeviceAdvertisements';
import {DevicesStackParamList} from '@/navigation/types';
import {useTheme} from '@/theme/ThemeProvider';
import {formatManufacturerData, formatUuid} from '@/utils/bleFormat';

export const DeviceDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<DevicesStackParamList, 'DeviceDetail'>>();
  const {device} = route.params;
  const {palette, spacing, typography} = useTheme();
  const {connected, error, connect, disconnect} = useBleDevice(device.id);
  const {
    records,
    saving,
    error: saveError,
    save,
    refresh,
  } = useDeviceAdvertisements(device.id);

  // Disconnect on unmount only — connection is initiated by user action.
  useEffect(
    () => () => {
      disconnect();
    },
    [disconnect],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: palette.background, padding: spacing.lg},
      ]}>
      <Text style={[typography.h2, {color: palette.text}]}>
        {device.name ?? 'Unnamed'}
      </Text>
      <Text
        style={[
          typography.caption,
          {color: palette.textMuted, marginTop: spacing.xs},
        ]}>
        {device.id}
      </Text>

      <View style={{marginTop: spacing.lg}}>
        <Field label="RSSI" value={fmt(device.rssi, v => `${v} dBm`)} />
        <Field
          label="TX power"
          value={fmt(device.txPowerLevel, v => `${v} dBm`)}
        />
        <Field
          label="Connectable"
          value={fmt(device.isConnectable, v => (v ? 'Yes' : 'No'))}
        />
        <Field
          label="Service UUIDs"
          value={
            device.serviceUUIDs && device.serviceUUIDs.length > 0
              ? device.serviceUUIDs.map(formatUuid).join('\n')
              : '—'
          }
        />
        <Field
          label="Manufacturer data"
          value={
            device.manufacturerData
              ? formatManufacturerData(device.manufacturerData)
              : '—'
          }
        />
      </View>

      <Text
        style={[
          typography.body,
          {color: palette.textMuted, marginTop: spacing.lg},
        ]}>
        {connected ? 'Connected' : 'Not connected'}
      </Text>
      {error ? (
        <Text style={{color: palette.error, marginTop: spacing.sm}}>
          {error}
        </Text>
      ) : null}

      <Button
        title={connected ? 'Disconnect' : 'Connect'}
        onPress={connected ? disconnect : connect}
        variant={connected ? 'secondary' : 'primary'}
        style={{marginTop: spacing.lg}}
      />

      <View style={{marginTop: spacing.xl}}>
        <Text style={[typography.h2, {color: palette.text}]}>
          Saved advertisements
        </Text>
        <Button
          title="Save advertisement"
          onPress={() => save(device)}
          loading={saving}
          style={{marginTop: spacing.md}}
        />
        {saveError ? (
          <Text style={{color: palette.error, marginTop: spacing.sm}}>
            {saveError}
          </Text>
        ) : null}

        {records.length === 0 ? (
          <Text
            style={[
              typography.body,
              {color: palette.textMuted, marginTop: spacing.md},
            ]}>
            None saved yet.
          </Text>
        ) : (
          records.map(r => (
            <View
              key={r.id}
              style={[
                styles.record,
                {borderColor: palette.border, padding: spacing.md, marginTop: spacing.sm},
              ]}>
              <Text style={[typography.body, {color: palette.text}]}>
                {fmt(r.rssi, v => `${v} dBm`)}
              </Text>
              <Text style={[typography.caption, {color: palette.textMuted}]}>
                {r.capturedAt}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

function fmt<T>(value: T | null, render: (v: T) => string): string {
  return value === null || value === undefined ? '—' : render(value);
}

const Field: React.FC<{label: string; value: string}> = ({label, value}) => {
  const {palette, spacing, typography} = useTheme();
  return (
    <View style={{marginTop: spacing.sm}}>
      <Text style={[typography.caption, {color: palette.textMuted}]}>
        {label}
      </Text>
      <Text style={[typography.body, {color: palette.text}]} selectable>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  record: {borderWidth: 1, borderRadius: 6},
});
