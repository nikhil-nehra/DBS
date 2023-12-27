import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  const [username, setUsername] = useState('');

  function handleConnect(user) {
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
