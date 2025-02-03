import React, { useEffect } from 'react';

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

  return <Navigation />;
};

const App: React.FC = () => (
  <Provider store={store}>
    <ReduxWrapper />
  </Provider>
);

export default App;
