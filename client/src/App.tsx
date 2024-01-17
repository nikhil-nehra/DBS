import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

interface AppProps {}

function App({}: AppProps): JSX.Element {
  const [username, setUsername] = useState<string>('');

  function handleConnect(user: string): void {
    setUsername(user);
  }

  return (
    <div className='App'>
      {username ? (
        <HomePage username={username} />
      ) : (
        <LoginPage onConnect={handleConnect} />
      )}
    </div>
  );
}

export default App;