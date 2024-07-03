import React, { useState, useEffect, useRef, useContext } from 'react';
import './ProfileEdit.css';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';


export interface AddPostData {
    description: string;
    address: string;
    date_of_start: string;
    date_of_finish: string;
    times: string;
    };
  

const iniPostData: AddPostData = {
    description: '',
    address: '',
    date_of_start: '',
    date_of_finish: '',
    times: '',
    };

interface AddPostProps {
    isOpen: boolean;
    onSubmit: (data: AddPostData) => void;
    onClose: () => void;
  };


  const AddPost: React.FC<AddPostProps> = ({onSubmit, isOpen, onClose, }) => 
    {

    //  user context
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("SignUpForm must be used within a UserProvider");
    }
    const { token , setToken } = userContext;

    const [redirectUrl, setRedirectUrl] = useState(localStorage.getItem("url"));
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));

    //  loading + error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    const [formState, setFormState] = useState<AddPostData>(iniPostData);
    
    
    // const [selectedDate, setSelectedDate] = useState(null);
    // const handleDateChange = (date: Date | null) => {
    //     setSelectedDate(date);
    // };

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

        // console.log(formState );
        // setFormState(ProfileData);
        // console.log("user == " );
        // console.log(user );
        //

        try {
        //   console.log(userId);


          const response = await axios.post('http://127.0.0.1:8000/api/posts/?id='+userId,
            {
              "owner_id":"",
              "organization_name": "",
              "contact_first_name":"",
              "description": formState.description,
              "date_of_start": formState.date_of_start,
              "date_of_finish": formState.date_of_finish,
              "times": formState.times,
              "phone_number": "",
              "email": "",
              "address": formState.address
              
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
              }
        });
    
        //   console.log(response.data);
        //   window.location.href = '/';
        window.location.href = '/profile';
        } catch (error) {
          setError(' ' + error);
        } finally {
          setLoading(false);
        }
    if (redirectUrl)
        window.location.href = redirectUrl; 

    // console.log(redirect);
    };
    return (
    <center>
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
    <br/>
    <form onSubmit={handleSubmit}>
    <div className="form-row">
        <label htmlFor="description">תאור אופי ההתנדבות</label>
        <input
            // ref={focusInputRef}
            type="text"
            id="description"
            name="description"
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
            value={formState.address}
            onChange={handleInputChange}
            required
        />
    </div>
    {/* <div className="form-row">
        <label htmlFor="date_of_start">תאריך התחלה</label>
        <input
            // ref={focusInputRef}
            type="date"
            id="date_of_start"
            name="date_of_start"
            value={formState.date_of_start}
            onChange={handleInputChange}
            required
        />
    </div> */}
    <div className="form-row">
        <label htmlFor="date_of_start">תאריך התחלה</label>
        <input
            // ref={focusInputRef}
            type="text"
            id="date_of_start"
            name="date_of_start"
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
            value={formState.date_of_finish}
            onChange={handleInputChange}
            required
        />
    </div>
    {/* <div className="form-row">
        <label htmlFor="date_of_finish">תאריך סיום</label>
        <input
            // ref={focusInputRef}
            type="date"
            id="date_of_finish"
            name="date_of_finish"
            value={formState.date_of_finish}
            onChange={handleInputChange}
            required
        />
        // <DatePicker
        //         selected={selectedDate}
        //         onChange={handleDateChange}
        //         dateFormat="yyyy-MM-dd"
        //         placeholderText="Select a date"
        //         // Add more props for customization (e.g., className, styles)
        // />
    </div> */}
    <div className="form-row">
        <label htmlFor="times">שעות</label>
        <input
            // ref={focusInputRef}
            type="text"
            id="times"
            name="times"
            value={formState.times}
            onChange={handleInputChange}
            required
        />
    </div>
    <div className="form-row">
        <button style={buttonStyle} type="submit">פרסם</button>
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
 
export default AddPost;
