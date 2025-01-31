import React, { useEffect } from 'react';

import Navigation from './components/Navigation';
import { PATIENT_ADDRESSES } from '@env';
import { Provider } from 'react-redux';
import { fetchAndSetPatients } from './redux/patientSlicer';
import { store } from './redux/store';
import { useAppDispatch } from './redux/hooks';

const patientAddresses = PATIENT_ADDRESSES.split(',');

const ReduxWrapper: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAndSetPatients(patientAddresses));
  }, [dispatch]);

  return <Navigation />;
};

const App: React.FC = () => (
  <Provider store={store}>
    <ReduxWrapper />
  </Provider>
);

export default App;
