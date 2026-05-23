import {NavigationContainer} from '@react-navigation/native';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ErrorBoundary} from '@/components/UI/ErrorBoundary';
import {initI18n} from '@/i18n';
import {RootNavigator} from '@/navigation/RootNavigator';
import {queryClient, queryPersister} from '@/services/api/queryClient';
import {configureGoogleSignIn} from '@/services/auth/googleSignIn';
import {initSentry} from '@/services/sentry/init';
import {ThemeProvider, useTheme} from '@/theme/ThemeProvider';
import {useNavigationTheme} from '@/theme/useNavigationTheme';

initSentry();
initI18n();
configureGoogleSignIn();

// Applies the themed status bar + navigation chrome, which are styled
// independently of screen content.
const ThemedNavigation: React.FC = () => {
  const {scheme, palette} = useTheme();
  const navTheme = useNavigationTheme();

  return (
    <>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={palette.surface}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    // Reserved for app-level startup (push token registration, deep links, etc.)
  }, []);

  return (
    <ErrorBoundary>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{persister: queryPersister}}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ThemedNavigation />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
