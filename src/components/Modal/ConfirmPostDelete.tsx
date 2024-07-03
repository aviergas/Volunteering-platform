import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

interface ConfirmDeletePostProps {
    isOpen: boolean;
    onSubmit: () => void;
    onClose: () => void;
  };

const ConfirmPostDelete: React.FC<ConfirmDeletePostProps> = ({onSubmit, isOpen, onClose, }) => 
{
    // const [formState, setFormState] = useState<ConfirmDeletePostData | null>(null);
    const [postId, setPostId] = useState(localStorage.getItem("selected_post"));
    const [redirectUrl, setRedirectUrl] = useState(localStorage.getItem("url"));

    //  loading + error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    
    useEffect(() => {
        if (isOpen && focusInputRef.current) {
          setTimeout(() => {
            focusInputRef.current!.focus();
          }, 0);
        }
      }, [isOpen]);


    // useEffect(() => {
    //   const fetchPost = async () => {
    //     try {

    //       // console.log("api/posts/{id}");
    //       // console.log(post_response.data);
    //     } catch (err) {
    //       setError(''+err);
    //     }
    //   };
  
    //   fetchPost();
    // }, []);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      setLoading(true);
      // setPostId(localStorage.getItem("seleceted_post"));
      console.log("postId")
      console.log(postId)
      if(postId)
      {
        console.log("Deleleleleleeeeeeetinnnnnnn");
        const response = await axios.delete('http://127.0.0.1:8000/api/posts/' + postId,
          {
            headers: {
              'accept': 'application/json',
            }
          });
        if (redirectUrl)
        {
          console.log("redirectUrl");
          console.log(redirectUrl);
          window.location.href = redirectUrl;
        }
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
          <label htmlFor="confirm">האם אתה בטוח ?</label>
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

export default ConfirmPostDelete;