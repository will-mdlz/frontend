import React from 'react';
//import TabManager from './components/TabManager';
import PageManager from './components/version2/PageManager';
import dataManagerInstance from './components/version2/DataManagement/Data';

function App() {
  dataManagerInstance.initialCalc();
  dataManagerInstance.calcConsolidatedSegment();
  return (
    <div className="App">
      <PageManager />
    </div>
  );
}

export default App;