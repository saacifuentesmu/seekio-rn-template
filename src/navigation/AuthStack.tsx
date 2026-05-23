import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {LoginScreen} from '@/screens/auth/LoginScreen';
import {SignUpScreen} from '@/screens/auth/SignUpScreen';

import {AuthStackParamList} from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{title: t('screens.login')}} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{title: t('screens.signUp')}} />
    </Stack.Navigator>
  );
};
