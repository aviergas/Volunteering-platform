import React, { useState, useEffect, useRef, useContext } from 'react';
import './ProfileEdit.css';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

// import jwt from 'jsonwebtoken';


interface User {
  id: string;
  address: string;
  description: string;
  first_name: string;
  last_name: string;
  org_name: string;
  email: string;
  phone: string;
  posts: number;
  // Add other user properties here
}

interface PostData {
    description: string;
    address:string;
    date_of_start: string;
    date_of_finish: string;
    times: string;
    };

  
interface ProfileEditProps {
    isOpen: boolean;
    onSubmit: (data: PostData) => void;
    onClose: () => void;
  };



const EditPost: React.FC<ProfileEditProps> = ({onSubmit, isOpen, onClose, }) => 
{

  

    //  user context
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("SignUpForm must be used within a UserProvider");
    }
    const { token , setToken } = userContext;
    const [user, setUser] = useState(null);
    
    const [userId, setUserId] = useState("");

    const [postId, setPostId] = useState(localStorage.getItem("selected_post"));
    const [post, setPost] = useState("");

    const [orgName, setOrgName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [description, setDescription] = useState("");
    const [date_of_start , setDateStart] = useState("");
    const [date_of_finish , setDateFinish] = useState("");
    const [times , setTimes] = useState("");

    const [redirectUrl, setRedirectUrl] = useState(localStorage.getItem("url"));

    //  loading + error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

  
    useEffect(() => {
        const fetchPost = async () => {
          try {

            //    api/posts/{id}
            const post_response = await axios.get('http://127.0.0.1:8000/api/posts/'+postId, {
              headers: {
                'accept': 'application/json'
              }
            });
            setPost(post_response.data);
            setDescription(post_response.data.description);
            setAddress(post_response.data.address);
            setDateStart(post_response.data.date_of_start);
            setDateFinish(post_response.data.date_of_finish);
            setTimes(post_response.data.times);
            setUserId(post_response.data.owner_id);
            
            // console.log("api/posts/{id}");
            // console.log(post_response.data);
          } catch (err) {
            setError(''+err);
          }
        };
    
        fetchPost();
      }, []);



    useEffect(() => {
        const fetchUser = async () => {
          try {

            //    api/users/{id}
            const user_response = await axios.get('http://127.0.0.1:8000/api/user/'+userId, {
              headers: {
                'accept': 'application/json',
              },
            });

            console.log(" api/users/" + userId);
            // console.log("id = " + userId);
            console.log(user_response.data);


            // console.log(user_response.data)
            setUser(user_response.data);
            setOrgName(user_response.data.org_name);
            setFirstName(user_response.data.first_name);
            setLastName(user_response.data.last_name);
            // setAddress(user_response.data.address);
            setPhone(user_response.data.phone)
            
          } catch (err) {
            setError(''+err);
          }
        };
    
        fetchUser();
      }, [userId]);


      const initPostData: PostData = {
        description: '',
        address:'',
        date_of_start: '',
        date_of_finish: '',
        times: '',
        };
    
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    const [formState, setFormState] = useState<PostData>(initPostData);


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
    };
    
    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        onSubmit(formState);

        // console.log(formState );
        // setFormState(ProfileData);
        // console.log("user == " );
        // console.log(user );
        //
        if (user)
        {
            
    
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/posts/'+postId, {
                owner_id: userId,
                organization_name: orgName,
                contact_first_name: firstName,
                description: formState.description,
                date_of_start: formState.date_of_start,
                date_of_finish: formState.date_of_finish,
                times: formState.times,
                phone_number: phone,
                email: email,
                address: formState.address
              }, {
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
        }
        catch (error) {
          console.error('There was an error updating the user!', error);
      }
    }
    if(redirectUrl)
      window.location.href = redirectUrl; 

    };
    
    return (
      <center>
        <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
        <br/>
        <form onSubmit={handleSubmit}>
{/* {/*  */}
            <div className="form-row">
            <label htmlFor="description">תיאור</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="description"
                name="description"
                placeholder={description}
                className="input-align-center"
                value={formState.description}
                onChange={handleInputChange}
                required
            />
            </div>
            <div className="form-row">
            <label htmlFor="address">כתובת</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="address"
                name="address"
                placeholder={address}
                className="input-align-center"
                value={formState.address}
                onChange={handleInputChange}
                required
            />
            </div>
   
            <div className="form-row">
            <label htmlFor="date_of_start">תאריך התחלה</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="date_of_start"
                name="date_of_start"
                placeholder={date_of_start}
                className="input-align-center"
                value={formState.date_of_start}
                onChange={handleInputChange}
                required
            />
            </div>
           
            <div className="form-row">
            <label htmlFor="date_of_finish">תאריך סיום</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="date_of_finish"
                name="date_of_finish"
                placeholder={date_of_finish}
                className="input-align-center"
                value={formState.date_of_finish}
                onChange={handleInputChange}
                required
            />
            </div>
            
            <div className="form-row">
            <label htmlFor="times">שעות</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="times"
                name="times"
                placeholder={times}
                className="input-align-center"
                value={formState.times}
                onChange={handleInputChange}
                required
            />
            </div>


            <div className="form-row">
            <button style={buttonStyle} type="submit">עדכן</button>
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
 
  
export default EditPost;

