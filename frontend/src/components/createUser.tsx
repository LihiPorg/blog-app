import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');

  return (
    <form data-testid="create_user_form" onSubmit={async (e) => {
      e.preventDefault();
      try{

      
    
     await axios.post('http://localhost:3001/users', form);
      navigate('/');
      }
      catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('User creation failed');
        }
      }
    }}>
      <input data-testid="create_user_form_name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input data-testid="create_user_form_email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input data-testid="create_user_form_username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
      <input data-testid="create_user_form_password" value={form.password} type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button data-testid="create_user_form_create_user" type="submit">Create User</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
