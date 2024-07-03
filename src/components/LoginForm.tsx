import React, { useContext, useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import App from '../App';
import loading_img from '../loading.gif'
import CryptoJS from 'crypto-js';

import {UserContext} from '../context/UserContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [hashedPassword, setHashedPassword] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
      setIsAdmin(event.target.checked);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [logged_in, SetLogin] = useState(false)

  const isLoggedind = () => {
    return logged_in;
  }

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if(redirect) {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 500); // 400 milliseconds = 0.4 seconds

    return () => clearTimeout(timer); // Cleanup the timeout if the component is unmounted
  
}}, [redirect]);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("SignUpForm must be used within a UserProvider");
  }

  const { token ,setToken } = userContext;


  // if(localStorage.getItem("user_token"))
  //   window.location.href = '/';

  const hashPassword = async (password: string) => {
    const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    setHashedPassword(hashed);
  };
  
  useEffect(() => {
    // console.log(token);
    const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    setHashedPassword(hashed);
    // console.log(hashedPassword);
  }, [password]);

  const [found_email, setFoundEmail] = useState('');
  const [found_password, setFoundPassword] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // const userData = ""
    try {
      // Basic form validation
      if (!email || !password) {
        throw new Error('Username and password are required.');
      }
      
      if(isAdmin)
      {
        const find_admin_by_mail = await axios.get('http://127.0.0.1:8000/api/users/admins/' + email.toLowerCase(), {
          headers: {
            'accept': 'application/json'
          }
        });
        console.log("fetching admin user .... " + email.toLowerCase())
        setFoundPassword(find_admin_by_mail.data['password']);
        setFoundEmail(find_admin_by_mail.data['email']);
        console.log(find_admin_by_mail)
      }
        else{
        const find_user_by_mail = await axios.get('http://127.0.0.1:8000/api/users/' + email.toLowerCase());
        console.log("fetching user .... ")
        setFoundPassword(find_user_by_mail.data['password']);
        setFoundEmail(find_user_by_mail.data['email']);
        console.log(found_email)
      }
      if (!found_email){
        
        throw new Error(email + ' is not registered');
      }

      // console.log(userData)

      await hashPassword(password);

      console.log("ha$h === " + hashedPassword);

      if (hashedPassword != found_password){
        console.log(hashedPassword);
        // console.log(userData['password']);

        throw new Error('wrong passworx ha$$$hhhin');
      }

      // Send login request to the server, we dont have server allready...
      //const response = await axios.post('http://localhost:3000/api/login', { username, password });
      //console.log(response.data); // Handle response as needed
      if(email.toLowerCase() === found_email && hashedPassword === found_password)
      {
        SetLogin(true);
        
        const response = await axios.post("http://127.0.0.1:8000/token",
          `grant_type=&username=${email.toLowerCase()}&password=${hashedPassword}&scope=&client_id=&client_secret=`,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          });
        setToken(response.data.access_token);
        setRedirect(true);
        
        // const token_response = await axios.get('http://127.0.0.1:8000/api/users/' + email);
        // console.log(token_response.data.access_token)
        // setToken(token_response.data.access_token);
        // window.location.href = '/';
        // window.location.replace('/');
        
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('שגיאה בהתחברות , וודא דוא"ל וסיסמא');
    } finally {
      setLoading(false);
      if(token)
      {
        window.location.href = '/';
      }
      
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
        <div> התחברות הנהלה
          <input
          type="checkbox"
          checked={isAdmin}
          onChange={handleAdminCheckboxChange}
        /> </div>
        <br/>
        <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>התחבר</button>
      </form>
    <br/>
    {loading && <center><div><img src={loading_img} style={{ width: '13%', alignSelf: 'center'}}/></div></center>}
    {loading && logged_in && <p style={{color: 'green'}}>...מתחבר</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );

};

export default LoginForm;