import React, { useState, useEffect, useRef, useContext } from 'react';
import './ProfileEdit.css';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import CryptoJS from 'crypto-js';


export interface AddUserData {
    id: string;
    password: string;
    org_name: string;
    description: string;
    phone: string;
    site_url: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  

const iniPostData: AddUserData = {
    id: 'string',
    password: 'e@m.ail',
    org_name: 'org_name',
    description: 'description',
    phone: 'phone',
    site_url: 'site_url',
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'e@m.ail'
  };

interface AddUserProps {
    isOpen: boolean;
    onSubmit: (data: AddUserData) => void;
    onClose: () => void;
  };

const EMAILRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddUser: React.FC<AddUserProps> = ({onSubmit, isOpen, onClose, }) => 
{

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
    
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    const [formState, setFormState] = useState<AddUserData>(iniPostData);
    
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


    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        onSubmit(formState);


        try {
            //   console.log(userId);

    
            if (!EMAILRegex.test(formState.email,)){
                throw new Error('דואר אלקטרוני לא תקין');
            }
            const find_user_by_mail = await axios.get('http://127.0.0.1:8000/api/users/' + formState.email.toLowerCase().toLowerCase(), {
                headers: {
                'accept': 'application/json'
                }
            });
            console.log(find_user_by_mail.data);
            if (Object.keys(find_user_by_mail.data).length !== 0){
                console.log("data");
                console.log(find_user_by_mail.data);
                throw new Error('משתמש '+ formState.email.toLowerCase() + " כבר רשום במערכת");
            }
            const response = await axios.post('http://127.0.0.1:8000/api/users/',
            {
                first_name: formState.first_name,
                last_name: formState.last_name,
                org_name: formState.org_name,
                email: formState.email.toLowerCase(),
                phone: formState.phone,
                password: hashedPassword,
                description: formState.description,
                site_url: formState.site_url,
                posts: 0,

            },
            {
                headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
                }
            });
        
            //   console.log(response.data);
            //   window.location.href = '/';

            window.location.href = '/userlist';

        } catch (error) {
          setError(' ' + error);
          console.log(error);
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
        <label htmlFor="first_name">שם פרטי</label>
        <input
            // ref={focusInputRef}
            type="first_name"
            id="first_name"
            name="first_name"
            value={formState.first_name}
            onChange={handleInputChange}
            required
        />
    </div>
    <div className="form-row">
        <label htmlFor="last_name">שם משפחה</label>
        <input
            // ref={focusInputRef}
            type="last_name"
            id="last_name"
            name="last_name"
            value={formState.last_name}
            onChange={handleInputChange}
            required
        />
    </div>
    <div className="form-row">
        <label htmlFor="org_name">שם הארגון</label>
        <input
            // ref={focusInputRef}
            type="org_name"
            id="org_name"
            name="org_name"
            value={formState.org_name}
            onChange={handleInputChange}
            required
        />
    </div>
    <div className="form-row">
        <label htmlFor="description">תאור הארגון</label>
        <input
            // ref={focusInputRef}
            type="description"
            id="description"
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            required
        />
    </div>
    <div className="form-row">
        <label htmlFor="phone">מס' טלפון</label>
        <input
            // ref={focusInputRef}
            type="phone"
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleInputChange}
            required
        />
    </div>
    <div className="form-row">
        <label htmlFor="site_url">כתובת אתר</label>
        <input
            // ref={focusInputRef}
            type="site_url"
            id="site_url"
            name="site_url"
            value={formState.site_url}
            onChange={handleInputChange}
            required
        />
    </div>
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
        <button style={buttonStyle} type="submit">הוסף</button>
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
 
export default AddUser;
