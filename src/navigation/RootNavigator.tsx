import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {useSessionStore} from '@/store/sessionStore';

import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
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
