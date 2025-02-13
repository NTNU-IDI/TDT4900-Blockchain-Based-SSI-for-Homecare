import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

import Navigation from './components/Navigation';
import { Provider } from 'react-redux';
import { fetchAndSetPatients } from './redux/patientSlicer';
import { fetchWorker } from './redux/workerSlicer';
import { store } from './redux/store';
import { useAppDispatch } from './redux/hooks';

const ReduxWrapper: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAndSetPatients());
    dispatch(fetchWorker());
  }, [dispatch]);

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top-10, 10) }]}>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </SafeAreaView>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <SafeAreaProvider>
    <ReduxWrapper />
    </SafeAreaProvider>
  </Provider>
);

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
});