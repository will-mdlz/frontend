import React, { useState } from 'react';
import PageManager from './components/version2/PageManager';
import SecurityPage
from './components/version2/SecurityPage';

console.clear();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sample password check function
  const handlePasswordSubmit = (password) => {
    const correctPassword = "willthebest";  // Replace with actual password handling
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const pageWithPassword = () => {
    return (
      <div className="App">
      {isAuthenticated ? (
        <PageManager />
      ) : (
        <SecurityPage onSubmit={handlePasswordSubmit} />
      )}
    </div>
    );
  }

  return (
    <div className="App">
      <PageManager />
    </div>
  );
}

export default App;
