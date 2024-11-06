import React, { useState } from 'react';
import PageManager from './components/version2/PageManager';
import SecurityPage
 from './components/version2/SecurityPage';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sample password check function
  const handlePasswordSubmit = (password) => {
    const correctPassword = "hello";  // Replace with actual password handling
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

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

export default App;
