import React, { useState, useEffect } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const VolunteeringPosts: React.FC = () => {
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [displayedPhoneNumber, setDisplayedPhoneNumber] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null); // New state variable

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/posts/');
      setPosts(response.data);
    } catch (error) {
      setError(''+error);
    } finally {
      setLoading(false);
    }
  }

  const showPhoneNumber = (phoneNumber: string, index: number) => { // Modified to take index
    setDisplayedPhoneNumber(phoneNumber);
    setSelectedRow(index); // Set the selected row index
  }

  return (
    <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
      <h2>פוסטים מחפשי מתנדבים</h2>
      <table style={{ borderCollapse: 'collapse', margin: '5px', display: 'inline-block' }}>
        <thead>
          <tr style={{ textAlign: 'right', border: '2px solid black' }}>
            <th style={thStyle}>צור קשר</th>
            <th style={thStyle}>כתובת</th>
            <th style={thStyle}>שעות התנדבות</th>
            <th style={thStyle}>תיאור</th>
            <th style={thStyle}>ארגון</th>
          </tr>
        </thead>
          
        <tbody>
          {posts.map((post, index) => (
            <tr key={index} style={{ textAlign: 'right', border: '2px solid black', backgroundColor: selectedRow === index ? 'lightblue' : 'white' }}> {/* Apply background color based on selectedRow */}
              <td style={tdStyle}>
                {displayedPhoneNumber !== post["phone_number"] && (
                  <button style={buttonStyle} onClick={() => showPhoneNumber(post["phone_number"], index)}> {/* Pass index to showPhoneNumber */}
                    הצג מספר טלפון
                  </button>
                )}
                {displayedPhoneNumber === post["phone_number"] && (
                  <div>{post["contact_first_name"]}<br/>{post["phone_number"]}</div>
                )}
              </td>
              <td style={tdStyle}>{post["address"]}</td>
              <td style={tdStyle}>{post["times"]}</td>
              <td style={tdStyle}>{post["description"]}</td>
              <td style={tdStyle}>{post["organization_name"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteeringPosts;


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