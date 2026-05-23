import {NavigatorScreenParams} from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type DevicesStackParamList = {
  DeviceList: undefined;
  DeviceDetail: {deviceId: string};
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
