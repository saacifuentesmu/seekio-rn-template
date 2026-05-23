import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {DeviceDetailScreen} from '@/screens/devices/DeviceDetailScreen';
import {DeviceListScreen} from '@/screens/devices/DeviceListScreen';
import {HomeScreen} from '@/screens/home/HomeScreen';
import {SettingsScreen} from '@/screens/settings/SettingsScreen';

import {AppTabParamList, DevicesStackParamList} from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();
const DevicesStack = createNativeStackNavigator<DevicesStackParamList>();

const DevicesNavigator: React.FC = () => {
  const {t} = useTranslation();
  return (
    <DevicesStack.Navigator>
      <DevicesStack.Screen name="DeviceList" component={DeviceListScreen} options={{title: t('screens.devices')}} />
      <DevicesStack.Screen name="DeviceDetail" component={DeviceDetailScreen} options={{title: t('screens.deviceDetail')}} />
    </DevicesStack.Navigator>
  );
};

export const AppStack: React.FC = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: t('screens.home')}} />
      <Tab.Screen name="Devices" component={DevicesNavigator} options={{title: t('screens.devices'), headerShown: false}} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{title: t('screens.settings')}} />
    </Tab.Navigator>
  );
};
