import { useState } from 'react';
import Form from '../components/UsernameForm';

function LoginPage({ onConnect }) {
  const [username, setUsername] = useState('');

  function handleChange(e) {
    setUsername(e.target.value);
  }

  return (
    <Form username={username} onChange={handleChange} connect={() => onConnect(username)} />
  );
}

export default LoginPage;
