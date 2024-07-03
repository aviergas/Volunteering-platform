import React, { useState, useEffect, useRef, useContext } from 'react';
import './ProfileEdit.css';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import CryptoJS from 'crypto-js';


export interface EditAdminData {
    id: string;
    email: string;
    password: string;
    };
  

const iniAdminData: EditAdminData = {
    id:'',
    email: '',
    password: '',
};

interface EditAdminProps {
    isOpen: boolean;
    onSubmit: (data: EditAdminData) => void;
    onClose: () => void;
  };


const EditAdmin: React.FC<EditAdminProps> = ({onSubmit, isOpen, onClose, }) => 
{
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("SignUpForm must be used within a UserProvider");
      }
  
    const { token , setToken } = userContext;
    
  // //  user context
  // const userContext = useContext(UserContext);
  // if (!userContext) {
  //     throw new Error("SignUpForm must be used within a UserProvider");
  // }
  // const { token , setToken } = userContext;
  // // const [user, setUser] = useState(null);

  //  loading + error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [id, setId] = useState(localStorage.getItem("selected_user_id"));
  const focusInputRef = useRef<HTMLInputElement | null>(null);
  const [formState, setFormState] = useState<EditAdminData>(iniAdminData);
  
  const [hashedPassword, setHashedPassword] = useState('');

  const hashPassword = async (password: string) => {
      const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      setHashedPassword(hashed);
    };

  useEffect(() => {
  // console.log(token);
  const hashed = CryptoJS.SHA256(formState.password).toString(CryptoJS.enc.Hex);
  setHashedPassword(hashed)
  }, [formState.password]);

      

  useEffect(() => {
      // console.log(token);
      if (isOpen && focusInputRef.current) {
      setTimeout(() => {
          focusInputRef.current!.focus();
      }, 0);
      }
  }, [isOpen]);
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = event.target;
      setFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      }));
      // console.log(ProfileData);
      // console.log(profileData);
  };


const handleSubmit = async (event: React.FormEvent): Promise<void> => 
{
  event.preventDefault();
  onSubmit(formState);
  
  try {
  //   console.log(userId);

    console.log(id);
    const response = await axios.put('http://127.0.0.1:8000/api/users/admins/'+id,
      {
        "email": formState.email,
        "password": hashedPassword

      },
      {
        headers: {
          "accept": "application/json",
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        }
  });

  //   console.log(response.data);
  //   window.location.href = '/';
  window.location.href = '/adminlist';
  } catch (error) {
    setError(' ' + error);
  } finally {
    setLoading(false);
  }

// window.location.href = '/profile'; 

// console.log(redirect);
};


  return (
  <center>
  <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
  <br/>
  <form onSubmit={handleSubmit}>
  <div className="form-row">
      <label htmlFor="email">אימייל</label>
      <input
          // ref={focusInputRef}
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          required
      />
  </div>
  <div className="form-row">
      <label htmlFor="password">סיסמא</label>
      <input
          // ref={focusInputRef}
          type="password"
          id="password"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
          required
      />
  </div>
  <br/>
  <div className="form-row">
      <button style={buttonStyle} type="submit">ערוך</button>
  </div>
  </form>
  </Modal>
  </center>
  )
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#82c8e6',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '9px',
    cursor: 'pointer',
  };
 
export default EditAdmin;
