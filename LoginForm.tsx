import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import App from './App';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useHistory

  const [logged_in, SetLogin] = useState(false)

  const isLoggedind = () => {
    return logged_in;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic form validation
      if (!email || !password) {
        throw new Error('Username and password are required.');
      }
      
      const find_user_by_mail = await axios.get('http://127.0.0.1:8000/users/' + email);
      console.log(find_user_by_mail)
      const not_registered = find_user_by_mail.data['found'] === "False"
      const userData = find_user_by_mail.data;

      if (not_registered){
        
        throw new Error(email + ' is not registered');
      }

      console.log(userData)

      if (password != userData['password']){
        throw new Error('wrong password');
      }

      // Send login request to the server, we dont have server allready...
      //const response = await axios.post('http://localhost:3000/api/login', { username, password });
      //console.log(response.data); // Handle response as needed
      if(email === userData['email'] && password === userData['password'])
      {
        SetLogin(true);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login. Please check your credentials and try again.');
    } finally {
      setLoading(false);
      
    }
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'center' }}>
        <div style={{ marginBottom: '10px' }}>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="דואר אלקטרוני" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        </div>
        <div style={{ marginBottom: '10px'}}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמא" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>התחבר</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {logged_in && <p style={{color: 'green'}}>...מתחבר</p>}
      </form>
    </div>
  );
};

export default LoginForm;