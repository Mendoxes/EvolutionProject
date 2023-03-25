import React from 'react';
import {Provider} from 'mobx-react';
import { GameStore} from './store/store';
import './App.css';
import Card from './components/Card';

function App() {
  return (

    <Provider store={GameStore}>
    <div className="App">
<Card></Card>
  
    </div>
    </Provider>
  );
}

export default App;
