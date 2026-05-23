import {NavigationContainer} from '@react-navigation/native';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ErrorBoundary} from '@/components/UI/ErrorBoundary';
import {initI18n} from '@/i18n';
import {RootNavigator} from '@/navigation/RootNavigator';
import {queryClient, queryPersister} from '@/services/api/queryClient';
import {configureGoogleSignIn} from '@/services/auth/googleSignIn';
import {initSentry} from '@/services/sentry/init';
import {ThemeProvider} from '@/theme/ThemeProvider';

initSentry();
initI18n();
configureGoogleSignIn();

export const App: React.FC = () => {
  useEffect(() => {
    // Reserved for app-level startup (push token registration, deep links, etc.)
  }, []);

  return (
    <ErrorBoundary>
      <PersistQueryClientProvider client={queryClient} persistOptions={{persister: queryPersister}}>
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
