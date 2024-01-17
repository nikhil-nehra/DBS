import React, { useState, ChangeEvent } from 'react';
import Form from '../components/UsernameForm';

interface LoginPageProps {
  onConnect: (username: string) => void;
}

function LoginPage({ onConnect }: LoginPageProps): JSX.Element {
  const [username, setUsername] = useState<string>('');

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setUsername(e.target.value);
  }

  return (
    <Form username={username} onChange={handleChange} connect={() => onConnect(username)} />
  );
}

export default LoginPage;
