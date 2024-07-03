
import React, { useState,  } from 'react';
import {useEffect, useRef, useContext} from 'react'
import axios from 'axios';
import {UserContext} from '../context/UserContext';

import CryptoJS from 'crypto-js';

//  some regex to help validate sign up form fields
const EMAILRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const ENGlettersRegex = /^[a-zA-Z]+$/;
// const HEBlettersRegex = /^[\u0590-\u05FF]+$/;

const SignUpForm: React.FC = () => {
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [org_name, setOrgname] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [site_url, setSiteUrl] = useState('');
  // const [address, setAddress] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("SignUpForm must be used within a UserProvider");
  }

  const { token ,setToken } = userContext;

  // const [, setToken] = userContext;

  const [redirect, setRedirect] = useState(false);



  useEffect(() => {
    if(redirect) {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 500); // 500 milliseconds = 0.5 seconds

    return () => clearTimeout(timer); // Cleanup the timeout if the component is unmounted
  
}}, [redirect]);




const hashPassword = async (password: string) => {
  const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  setHashedPassword(hashed);
};

useEffect(() => {
  // console.log(token);
  const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  setHashedPassword(hashed)
}, [password]);


  //  handle form submition
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError('');

    try 
    {
      await hashPassword(password);
      
      console.log("ha$h === " + hashedPassword);


      //  first and last name validation
      if (!first_name || !last_name) {
        throw new Error('שם ושם משפחה הינם שדות חובה');
      }
      if (!org_name) {
        throw new Error('שם ארגון הינו שדות חובה');
      }
      if (!description) {
        throw new Error('תאור הארגון הינו שדות חובה');
      }
      // if (!ENGlettersRegex.test(last_name) ){
      //   throw new Error('last name should contain letters only (hebrew or english)');
      // }
      if(!phone){
        throw new Error("מס' טלפון הינו שדה חובה");
      }
      //  email validation
      if (!email) {
        throw new Error('דואר אלקטרוני הינו שדה חובה');
      }
      //  send 'get_user_by_mail' request to backend server
      const find_user_by_mail = await axios.get('http://127.0.0.1:8000/api/users/' + email.toLowerCase());
      //  boolean value to check if user is already registered in database

      
      console.log("email === " + email.toLowerCase());
      console.log(find_user_by_mail.data);

      if (!find_user_by_mail.data){
        const userData = find_user_by_mail.data;
        throw new Error(userData['email'] + ' משתמש כבר רשום');
      }

      if (!EMAILRegex.test(email)){
        throw new Error('דואר אלקטרוני לא תקין');
      }
      
      //  password validation

      if (password.length < 5){
        throw new Error('סיסמא חייבת להכיל לפחות 5 תווים');
      }
      if (password !== confirm_password){
        throw new Error('passswords should match');
      }
      
      if(!hashedPassword){
        // if(hashed)
        //   {
        //     setHashedPassword(hashed);
        //   }
        throw new Error("password");
      }
      // if(!address){
      //   throw new Error('כתובת הינו שדה חובה');
      // }


      // send signup request to the server
      const response = await axios.post('http://127.0.0.1:8000/api/users', 
                                      {
                                        "first_name": first_name,
                                        "last_name": last_name,
                                        "org_name" : org_name,
                                        "email": email.toLowerCase(), 
                                        "phone": phone, 
                                        // "address": address,
                                        "password": hashedPassword, 
                                        "description" : description,
                                        "site_url" : site_url,
                                        "posts" : 0
                                      }, {
                                        headers: {
                                          'Accept': 'application/json',
                                          'Content-Type': 'application/json'
                                        }
                                      });
      // console.log(response.data);
      if (response.status !== 200) {
        setError("אנערף ??");
      }
      else{
        
        console.log(response.status);
        console.log(response.data.access_token);
        setToken(response.data.access_token);
      }
      setRegistered(true);
      setError('');
      setRedirect(true);
    }
    catch (error) 
    {
      console.error('Error signing up:', error);
      setRegistered(false);
      setError(''+error);
      // console.log({error});
      
      // console.log({registered});
    }
    finally
    {
      setLoading(false);
    
    }
  };


  

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>טופס הרשמה</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'center' }}>
      
      <table >
      <tr  >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="text" value={first_name} onChange={(e) => setFirstname(e.target.value)} placeholder="שם פרטי" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right'}} />
        </td> 
        <td style={{textAlign: 'right'}}>שם פרטי</td>
      </tr>

      <tr >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="text" value={last_name} onChange={(e) => setLastname(e.target.value)} placeholder="שם משפחה" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        </td>
        <td style={{textAlign: 'right'}}>שם משפחה</td>
      </tr>

      <tr  >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="text" value={org_name} onChange={(e) => setOrgname(e.target.value)} placeholder="שם ארגון" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right'}} />
        </td> 
        <td style={{textAlign: 'right'}}>שם ארגון</td>
      </tr>

      <tr  >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="תאור הארגון" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right'}} />
        </td> 
        <td style={{textAlign: 'right'}}>תאור הארגון</td>
      </tr>

      <tr >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="text" value={phone} onChange={(e) => setPhonenumber(e.target.value)} placeholder="מס' טלפון" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        </td>
        <td style={{textAlign: 'right'}}>מס' טלפון</td>
      </tr>

      <tr >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}> * 
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="דואר אלקטרוני" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        
        </td>
        <td style={{textAlign: 'right', marginLeft: '5px'}}>דואר אלקטרוני</td>
      </tr>

      <tr >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמא" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        
        </td>
        <td style={{textAlign: 'right'}}>סיסמא</td>
      </tr>
      
      <tr >
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="אימות סיסמא" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        
        </td>
        <td style={{textAlign: 'right'}}>שוב סיסמא</td>
      </tr>

      <tr >

        <input type="text" value={site_url} onChange={(e) => setSiteUrl(e.target.value)} placeholder="כתובת אתר אינטרנט" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        
        <td style={{textAlign: 'right'}}>כתובת אתר אינטרנט</td>
      </tr>

    </table>

    <h3> </h3>
    <button type="submit" disabled={loading} style={{ alignContent: 'center', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>הרשמה</button>
      
      {error && 
      <div>
        <p style={{ color: 'red' }}>הרשמה נכשלה <br/> {error.replace("Error: ", "")}</p>
        
      </div>}

      {registered && 
      <div> 
        <p style={{ color: 'green' }}>נרשמת בהצלחה</p>
        {/* <p style={{ color: 'red' }}>{error}</p> */}
        
      </div>}
      
      </form>
    </div>
  );
};

export default SignUpForm;
