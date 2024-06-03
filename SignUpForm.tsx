

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import App from './App';

//  some regex to help validate sign up form fields
const EMAILRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENGlettersRegex = /^[a-zA-Z]+$/;
const HEBlettersRegex = /^[\u0590-\u05FF]+$/;

const SignUpForm: React.FC = () => {
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [org_name, setOrgname] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  

  //  handle form submition
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError('');

    try 
    {
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
      const find_user_by_mail = await axios.get('http://127.0.0.1:8000/users/' + email);
      //  boolean value to check if user is already registered in database
      const not_registered = find_user_by_mail.data['found'] === "False"
  
      if (!not_registered){
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

      if(!address){
        throw new Error('כתובת הינו שדה חובה');
      }

      // send signup request to the server
      const response = await axios.post('http://127.0.0.1:8000/users', 
                                      {
                                        "first_name": first_name,
                                        "last_name": last_name,
                                        "org_name" : org_name,
                                        "description" : description,
                                        "phone": phone, 
                                        "address": address,
                                        "email": email, 
                                        "password": password, 

                                      });
      console.log(response.data);
      setRegistered(true)
      setError('')
      window.location.href = '/';
    }
    catch (error) 
    {
      console.error('Error signing up:', error);
      setRegistered(false)
      setError(''+error);
      console.log({error});
      
      console.log({registered});
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
        <td style={{color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px'}}>*
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="כתובת" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
        
        </td>
        <td style={{textAlign: 'right'}}>כתובת</td>
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
