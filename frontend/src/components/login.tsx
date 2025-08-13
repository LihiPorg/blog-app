import { useState } from 'react';
import { useUserActions } from '../contexts/UsersContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useUserActions();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <form data-testid="login_form" onSubmit={async (e) => {
  e.preventDefault();
  const errorMessage = await login(username, password);
  if (!errorMessage) {
    navigate('/');
  } else {
    setError(errorMessage);
  }
}}>

      <input data-testid="login_form_username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input data-testid="login_form_password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button data-testid="login_form_login" type="submit">Login</button>
      {error && <p className="error">{error}</p>}

    </form>
  );
}
