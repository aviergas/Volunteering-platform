import React, { useState, useEffect } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserList: React.FC = () => {
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/');
      setUsers(response.data);
    } catch (error) {
      setError(''+error);
    } finally {
      setLoading(false);
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setLoading(true)
      const response = await axios.delete('http://127.0.0.1:8000/users/' + id);
      window.location.href = '/userlist';
    } catch (error) {
      setError(''+error);
    } finally {
      setLoading(false);
    } 
  }

  return (
    <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
      <h2>משתמשים</h2>
      <table style={{ borderCollapse: 'collapse', margin: '5px', display: 'inline-block' }}>
        <thead>
          <tr style={{ textAlign: 'right', border: '2px solid black' }}>
          <th style={thStyle}>מחק</th>
          <th style={thStyle}>ערוך</th>
            <th style={thStyle}>פוסטים</th>
            <th style={thStyle}>איש קשר</th>
            <th style={thStyle}>כתובת</th>
            <th style={thStyle}>מס' טלפון</th>
            <th style={thStyle}>תיאור</th>
            
            <th style={thStyle}>מייל</th>
            <th style={thStyle}>שם ארגון</th>
          </tr>
        </thead>
          
        <tbody>
          {users.map((user, index) => (
            
            
            <tr key={index} style={{ textAlign: 'right', border: '2px solid black'}}>

              <td style={tdStyle}>
                <button style={buttonStyle} onClick={() =>deleteUser(user["id"])}>מחק</button>
              </td>
              
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              
              <td style={tdStyle}>{user["first_name"] + " " + user["last_name"]}</td>
              <td style={tdStyle}>{user["phone"]}</td>
              <td style={tdStyle}>{user["address"]}</td>
              <td style={tdStyle}>{user["description"]}</td>
              
              <td style={tdStyle}>{user["email"]}</td>
              <td style={tdStyle}>{user["org_name"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;


const tdStyle: React.CSSProperties = {
  border: '1px solid black',
  textAlign: 'center',
  padding: '8px 12px'
  // borderRadius: '4px',
};

const thStyle: React.CSSProperties = {
  border: '1px solid black',
  textAlign: 'center',
  padding: '8px 12px'

};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#82c8e6',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '9px',
  cursor: 'pointer',
};