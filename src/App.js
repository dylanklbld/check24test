import './App.css'

import {GameGrid} from './game/GameGrid';
import React from 'react';

function App() {
  return (
    <div className="App">
      <p>tEST TASK</p>
      <div className="grid-wrapper" >
        <div className="grid-area">
          <GameGrid size={6} colors={4}/>
        </div>
      </div>
    </div>
  );
}

export default App;
