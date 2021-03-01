import React from 'react';
import './App.css';
import Recorder from '../Recorder';
import Calender from '../Calender'

const App: React.FC = () => {
  return (
    <div className="App">
      <Recorder />
      <Calender />
    </div>
  );
};

export default App;
