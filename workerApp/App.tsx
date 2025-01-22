import Navigation from './components/Navigation';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from './redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
