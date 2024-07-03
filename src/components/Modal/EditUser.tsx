import React, { useState, useEffect, useRef, useContext } from 'react';
import './ProfileEdit.css';
import Modal from './Modal';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import {ProfileEditData} from '../../interfaces/interfaces'
// import jwt from 'jsonwebtoken';



interface ProfileEditProps {
  isOpen: boolean;
  onSubmit: (data: ProfileEditData) => void;
  onClose: () => void;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({onSubmit, isOpen, onClose, }) => 
{

  

    //  user context
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("SignUpForm must be used within a UserProvider");
    }
    const { token , setToken } = userContext;
    const [user, setUser] = useState(null);
    
    const [selected_email, setSelectedEmail] = useState(localStorage.getItem("email"));
    const [redirectUrl, setRedirectUrl] = useState(localStorage.getItem("url"));

    const [userId, setUserId] = useState("11111111");
    const [oldOrgName, setOldOrgName] = useState("");
    const [oldDescription, setOldDescription] = useState("");
    const [oldPhone , setOldPhone] = useState("");
    const [oldFirstName , setOldFirstName] = useState("");
    const [oldLastName , setOldLastName] = useState("");
    const [oldEmail , setOldEmail] = useState("");
    const [oldSiteUrl, setOldSiteUrl] = useState("");

    const [userPass, setUserPass] = useState("11111111");
    const [userPostCount, setUserPostCount] = useState(0);
    

    //  loading + error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

  

    //     api/users/{email}
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const user_response = await axios.get('http://127.0.0.1:8000/api/users/'+selected_email, {
              headers: {
                'accept': 'application/json',
              },
            });
            console.log(user_response.data)
            setUser(user_response.data);
            setUserId(user_response.data._id.$oid);
            setUserPass(user_response.data.password);
            setUserPostCount(user_response.data.posts);
            setOldOrgName(user_response.data.org_name);
            setOldSiteUrl(user_response.data.site_url);
            setOldDescription(user_response.data.description);
            setOldPhone(user_response.data.phone);
            setOldLastName(user_response.data.last_name);
            setOldFirstName(user_response.data.first_name);
            // setAddress(user_response.data.address);
            setOldEmail(user_response.data.email);
            
            // const { _id, password, posts, ...profileData } = user_response.data;
            
          } catch (error) {
            setError('Error fetching user data');
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, []);
    
      const initProfileData: ProfileEditData = {
        org_name: '',
        description: '',
        phone: '',
        site_url: '',
        first_name: '',
        last_name: '',
        email: '',
      };
    
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    const [formState, setFormState] = useState<ProfileEditData>(initProfileData);


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

    const log_out = () => {
      setToken(null);
      localStorage.removeItem("user_token")
    }

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
          // console.log(userId);

          //      update user by id
          const response = await axios.put('http://127.0.0.1:8000/api/users/'+userId, {
            first_name: formState.first_name,
            last_name: formState.last_name,
            org_name: formState.org_name,
            email: formState.email.toLowerCase(),
            phone: formState.phone,
            password: userPass,
            description: formState.description,
            site_url: formState.site_url,
            posts: userPostCount
            }, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          });

          // if(oldEmail !== formState.email.toLowerCase())
          //   {
          //     log_out();
          //   }
         


          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          //     * * TODO * *
          //    update all posts published by user


      } catch (error) {
          console.error('There was an error updating the user!', error);
      }
    }
    if(redirectUrl)
      window.location.href = redirectUrl; 

    // console.log(redirect);
    };
    
    return (
      <center>
        <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
        <br/>
        <form onSubmit={handleSubmit}>

            <div className="form-row">
            <label htmlFor="org_name">שם הארגון</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="org_name"
                name="org_name"
                placeholder={oldOrgName}
                className="input-align-center"
                value={formState.org_name}
                onChange={handleInputChange}
                required
            />
            </div>
            <div className="form-row">
            <label htmlFor="description">תיאור</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="description"
                name="description"
                placeholder={oldDescription}
                className="input-align-center"
                value={formState.description}
                onChange={handleInputChange}
                required
            />
            </div>
            <div className="form-row">
            <label htmlFor="site_url">אתר אינטרנט</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="site_url"
                name="site_url"
                placeholder={oldSiteUrl}
                className="input-align-center"
                value={formState.site_url}
                onChange={handleInputChange}
            />
            </div>
            <div className="form-row">
            <label htmlFor="phone">מס' טלפון</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="phone"
                name="phone"
                placeholder={oldPhone}
                className="input-align-center"
                value={formState.phone}
                onChange={handleInputChange}
                required
            />
            </div>
            {/* <div className="form-row">
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
            </div> */}
            <div className="form-row">
            <label htmlFor="first_name">שם פרטי</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="first_name"
                name="first_name"
                placeholder={oldFirstName}
                className="input-align-center"
                value={formState.first_name}
                onChange={handleInputChange}
                required
            />
            </div>
            <div className="form-row">
            <label htmlFor="last_name">שם משפחה</label>
            <input
                // ref={focusInputRef}
                type="text"
                id="last_name"
                name="last_name"
                placeholder={oldLastName}
                className="input-align-center"
                value={formState.last_name}
                onChange={handleInputChange}
                required
            />
            </div>

            <div className="form-row">
            <label htmlFor="email">דואר אלקטרוני</label>
            <input
                // ref={focusInputRef}
                type="email"
                id="email"
                name="email"
                placeholder={oldEmail}
                className="input-align-center"
                value={formState.email}
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
 
  
export default ProfileEdit;

