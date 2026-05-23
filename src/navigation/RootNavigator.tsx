import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';
import {RootStackParamList} from './types';

import {SplashView} from '@/components/UI/SplashView';
import {useSessionRestore} from '@/hooks/auth/useSessionRestore';
import {useSessionStore} from '@/store/sessionStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const {status} = useSessionRestore();
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);

  if (status === 'restoring') return <SplashView />;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};
