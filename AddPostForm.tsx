import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import App from './App';

const AddPostForm: React.FC = () => {

  const [description, setDescription] = useState('');
  const [date_of_start, setDateOfStart] = useState('');
  const [date_of_finish, setDateOfFinish] = useState('');
  const [times, setTimes] = useState('');
  const [address, setAddress] = useState('');

  //    we need to get the real data of the org_user that fills the form
  const [organization_name, setOrgName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [contact_first_name, setFirstName] = useState('')


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posted, setPosted] = useState(false)
  const navigate = useNavigate(); // Initialize useHistory


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPosted(false);

    try {

      if (!description) {
        throw new Error('חובה לתת תיאור קצר');
      }
      if (!date_of_start) {
        throw new Error('מאיזה תאריך צריך מתנדבים ?');
      }
      if (!date_of_finish) {
        throw new Error('עד איזה תאריך צריך מתנדבים ?');
      }
      if (!times) {
        throw new Error('מהם שעות ההתנדבות ?');
      }

      const response = await axios.post('http://127.0.0.1:8000/posts/',
        {
          "organization_name": organization_name,
          "contact_first_name":contact_first_name,
          "description": description,
          "date_of_start": date_of_start,
          "date_of_finish": date_of_finish,
          "times": times,
          "phone_number": phone_number,
          "address": address
          
        });

      console.log(response.data);
      setPosted(true);

    } catch (error) {
      setError(' ' + error);
    } finally {
      setLoading(false);
      

      
      // window.location.href = '/';
    }
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>העלאת פוסט</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'center' }}>

        <table >
        <thead>
          <tr  >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={organization_name} onChange={(e) => setOrgName(e.target.value)} placeholder="שם ארגון" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
            </td>
            <td style={{ color: 'green', textAlign: 'right' }}>שם ארגון</td>
          </tr>
        </thead>

        <tbody>
          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="תיאור" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
            </td>
            <td style={{ textAlign: 'right' }}>תיאור</td>
          </tr>

          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={date_of_start} onChange={(e) => setDateOfStart(e.target.value)} placeholder="תאריך התחלה" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />
            </td>
            <td style={{ textAlign: 'right' }}>תאריך התחלה</td>
          </tr>

          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}> *
              <input type="text" value={date_of_finish} onChange={(e) => setDateOfFinish(e.target.value)} placeholder="תאריך סיום" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />

            </td>
            <td style={{ textAlign: 'right', marginLeft: '5px' }}>תאריך סיום</td>
          </tr>

          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={times} onChange={(e) => setTimes(e.target.value)} placeholder="זמני התנדבות" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />

            </td>
            <td style={{ textAlign: 'right' }}>זמני התנדבות</td>
          </tr>

          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="טלפון ליצירת קשר" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />

            </td>
            <td style={{ color: 'green', textAlign: 'right' }}>מס' טלפון</td>
          </tr>
          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={contact_first_name} onChange={(e) => setFirstName(e.target.value)} placeholder="שם איש קשר" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />

            </td>
            <td style={{ color: 'green', textAlign: 'right' }}>שם איש קשר</td>
          </tr>
          <tr >
            <td style={{ color: 'red', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px' }}>*
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="כתובת" style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'right' }} />

            </td>
            <td style={{color: 'green', textAlign: 'right' }}>כתובת</td>
          </tr>
          </tbody>
        </table>

        <h3> </h3>
        <button type="submit" disabled={loading} style={{ alignContent: 'center', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>פרסם</button>
       {error &&
          <div>
            <p style={{ color: 'red' }}></p>
            <p style={{ color: 'red' }}>:העלאת הפוסט נכשלה <br/>{error.replace("Error: ", "")}</p>
          </div>}
        
        {posted &&
        <div>
          <p style={{color: 'green'}}>פוסט הועלה לאתר בהצלחה</p>
        </div>}

      </form>
    </div>
  );
};

export default AddPostForm;