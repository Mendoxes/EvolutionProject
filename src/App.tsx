import React from 'react';
import { Provider } from 'mobx-react';
import { GameStore } from './store/store';
import './App.css';
import { StoreObserver } from './components/Card';

function App()
{
  return (

    <Provider store={GameStore}>
      <div className="App">
        <StoreObserver></StoreObserver>

      </div>
    </Provider>
  );
}

export default App;
