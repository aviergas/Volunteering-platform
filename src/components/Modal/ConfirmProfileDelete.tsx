import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { response } from 'express';

interface ConfirmDeletePostProps {
    isOpen: boolean;
    onSubmit: () => void;
    onClose: () => void;
  };

const ConfirmProfileDelete: React.FC<ConfirmDeletePostProps> = ({onSubmit, isOpen, onClose, }) => 
{    
  
  
  // const [email, setEmail] = useState("");

    //  loading + error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const userContext = useContext(UserContext);
    
    if (!userContext) {
      throw new Error("SignUpForm must be used within a UserProvider");
    }
  
    const { token , setToken } = userContext;
  
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    
    useEffect(() => {
      if (isOpen && focusInputRef.current) {
          setTimeout(() => {
            focusInputRef.current!.focus();
          }, 0);
        }
      }, [isOpen]);
      
    const isAdmin = localStorage.getItem("admin");
    const url = localStorage.getItem("url");
    


  //   delete posts
  const deleteProfile = async (email: string) => {
    try {
      setLoading(true)
      // if(isAdmin)
      // {
        
        console.log("deleting user " + email);
        const response = await axios.delete('http://127.0.0.1:8000/api/users/' + email,
          {
              headers: {
                  'accept': 'application/json',
                  Authorization: `Bearer ${token}`,
                }
          }
        );

      // }
      
    //   console.log(id);
      
    } catch (error) {
      // setError(''+error);
    } finally {
      setLoading(false);
    } 
  };


  const log_out = () => {
    if(isAdmin)
    {
      const rediredctUrl = localStorage.getItem("url");
      if (rediredctUrl)
        window.location.href = rediredctUrl;     
    }
      
    else
    {
      setToken(null);
      localStorage.removeItem("user_token");
      // localStorage.removeItem("admin");
      window.location.href = '/';
    }
  }
  
  const [email, setEmail] = useState(localStorage.getItem("email"));
  
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    // setEmail(localStorage.getItem("Email"));
    try {
      setLoading(true);
      if(email)
      {  
        await deleteProfile(email);
        log_out();
        
      }
      onClose(); 
    } catch (error) {
      setError(' ' + error);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <center>
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
      <br/>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="confirm">? האם אתה בטוח </label>
          {url!='/adminlist' && <>
          מחיקת המשתמש תמחק גם את המודעות שלו ממסד הנתונים
          </>}
        </div>

        <div className="form-row">
          <table>
            <tr style={{padding: '7px'}}>
              <td><button style={buttonStyle} type="submit">כן</button></td>
              <td><button style={buttonStyle} onClick={onClose}>לא</button></td>
            </tr>
          </table>
        </div>
      </form>
    </Modal>
    </center>
  );
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#82c8e6',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '9px',
  cursor: 'pointer',
};

export default ConfirmProfileDelete;