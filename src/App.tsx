import React from 'react';
import {Provider} from 'mobx-react';
import { GameStore} from './store/store';
import './App.css';
import CardF from './components/Card';

function App() {
  return (

    <Provider store={GameStore}>
    <div className="App">
<CardF></CardF>
  
    </div>
    </Provider>
  );
}

export default App;
