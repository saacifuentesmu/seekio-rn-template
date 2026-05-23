import {NavigatorScreenParams} from '@react-navigation/native';

import {PairedDevice} from '@/services/backend/ports/devicePairing';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type DevicesStackParamList = {
  DeviceList: undefined;
  DeviceDetail: {device: PairedDevice};
};

export type AppTabParamList = {
  Home: undefined;
  Devices: NavigatorScreenParams<DevicesStackParamList>;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};
