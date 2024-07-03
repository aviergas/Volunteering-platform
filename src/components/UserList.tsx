import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
// import 'bulma/css/bulma.min.css';
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import ProfileEdit from "./Modal/EditUser";
import ConfirmProfileDelete from "./Modal/ConfirmProfileDelete";
import AddUser from "./Modal/AddUser";

interface ProfileEditData {
  org_name: string;
  description: string;
  phone: string;
  site_url: string;
  first_name: string;
  last_name: string;
  email: string;
};


interface User {
  id: string;
  password: string;
  org_name: string;
  description: string;
  phone: string;
  site_url: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Table = () => {
  const [email, setEmail] = useState("");



    //      add user pop up !!!!!!!!!!!!
  const [isAddUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [addUserData, setAddUserData] = useState<User | null>(null);
  
  const handleOpenAddUser = () => {
    console.log("clickecyclack");
    setAddUserOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserOpen(false);
  };

  const handleUserFormSubmit = (data: User): void => {
    setAddUserData(data);
    handleCloseAddUserModal();
  };

  //      edit profile pop up
  const [isEditProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const [editProfileData, setEditProfileData] = useState<ProfileEditData | null>(null);
  
  const handleOpenProfileEditModal = (email:string) => {
    localStorage.setItem("email", email)
    localStorage.setItem("url", '/userlist')
    setEditProfileOpen(true);
    console.log(isEditProfileOpen)
  };

  const handleCloseProfileEditModal = () => {
    localStorage.removeItem("url");
    localStorage.removeItem("email");
    setEditProfileOpen(false);
  };

  const handleFormSubmit = (data: ProfileEditData): void => {
    setEditProfileData(data);
    handleCloseProfileEditModal();
  };

  
  //  delete profile pop up
  const [isConfirmDeleteProfileOpen, setConfirmDeleteProfileOpen] = useState<boolean>(false);

  const handleOpenConfirmDeleteProfile = (email: string) => {
    localStorage.setItem("url", '/userlist');
    localStorage.setItem("email", email);
    setConfirmDeleteProfileOpen(true);
  };

  const handleCloseConfirmDeleteProfileModal = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("url");
    setConfirmDeleteProfileOpen(false);
  };
  
  const handleConfirmDeleteProfileFormSubmit = (): void => {
    handleCloseConfirmDeleteProfileModal();
  };

    // .....  USER  CONTEXT  .....

    const userContext = useContext(UserContext);
      if (!userContext) {
        throw new Error("SignUpForm must be used within a UserProvider");
      }
    const { token , setToken } = userContext;
  
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);


  const getUsers = async () => {
    setLoading(true);
    // setError('');
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/users/');
      setUsers(response.data);
      // console.log(response);
    } catch (error) {
      // setError(''+error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);



  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("admin"));

  return (
    <div>
    {/* <UserListPopUp active={activePop} handlePop={handlePop} token={token} id={id} /> */}
    
    {isAdmin &&
    <center>
    <br/>
    <button
     className="button mb-5 is-primary"
     style={buttonStyle}
     onClick={handleOpenAddUser}
     >
      הוסף
    </button><br/>
    </center>
    }

    {/* UNAUTHORIZED MESSAGE */}
    {/* {!isAdmin && <p style={{ color: 'red', textAlign:'center'}}>דף זה לא קיים</p>} */}


    {
    // isAdmin &&
     !loading && users.length>0 && <center>
        <table style={{ borderCollapse: 'collapse', margin: '5px', display: 'inline-block', width: '80%'}}>
        <thead>

          {isAdmin && <th style={thStyle}>מחק</th>}
          {isAdmin &&<th style={thStyle}>ערוך</th>}
            <th style={thStyle}>פוסטים</th>
            <th style={thStyle}>איש קשר</th>
            <th style={thStyle}>אתר</th>
            <th style={thStyle}>מס' טלפון</th>
            <th style={thStyle}>תיאור</th>
            
            <th style={thStyle}>מייל</th>
            <th style={thStyle}>שם ארגון</th>
        </thead>
          
        <tbody>
          {users.map((user, index) => (
            
            
            <tr key={index} style={{ textAlign: 'right', border: '2px solid black'}}>
              {isAdmin && 
                <td style={tdStyle}>
                <button 
                onClick={()=>handleOpenConfirmDeleteProfile(user["email"])}
                style={delButtonStyle}
                className="button mr-2 is-danger is-light" 
                >מחק</button>
              </td>
              }
            {isAdmin && 
            <td style={tdStyle}>
                <button
                onClick={()=>handleOpenProfileEditModal(user["email"])} 
                style={buttonStyle}
                className="button mr-2 is-info is-light"
                >ערוך</button>
              </td>
            }
              <td style={tdStyle}><center>{user["posts"]}</center></td>
              
              <td style={tdStyle}>{user["first_name"] + " " + user["last_name"]}</td>
              <td style={tdStyle}><a href={user["site_url"]}>{user["site_url"]}</a></td>
              <td style={tdStyle}>{user["phone"]}</td>
              <td style={tdStyle}>{user["description"]}</td>
              
              <td style={tdStyle}>{user["email"]}</td>
              {/* <td style={tdStyle}>{user["org_name"]}</td> */}
              <td style={tdStyle}> <a href={`/user/${user["id"]}`}>{user["org_name"]}</a></td>

            </tr>
          ))}
        </tbody>
      </table>
      {editProfileData && editProfileData.email && (
        <div className="msg-box">
          <b>{editProfileData.email}</b> פרטים עודכנו בהצלחה
        </div>
      )}

      {isAddUserOpen && <AddUser
        isOpen={true}
        onSubmit={handleUserFormSubmit}
        onClose={handleCloseAddUserModal} />}
        
      {isEditProfileOpen && <ProfileEdit
        isOpen={true}
        onSubmit={handleFormSubmit}
        onClose={handleCloseProfileEditModal} />}

      {isConfirmDeleteProfileOpen && <ConfirmProfileDelete
        isOpen={true}
        onSubmit={handleConfirmDeleteProfileFormSubmit}
        onClose={handleCloseConfirmDeleteProfileModal}/>}  
      
      </center>
    }

    {!loading && users.length==0 && <center><h1>אין משתמשים רשומים במערכת</h1></center>}

    </div>

);
};


const thStyle: React.CSSProperties = {
    // border: '1px solid black',
    margin: '5px',
    textAlign: 'center',
    padding: '8px 12px',
    // color: 'black',
  
  };
const tdStyle: React.CSSProperties = {
    // border: '1px solid black',
    textAlign: 'center',
    margin: '5px',
    padding: '8px 12px',
    // color: 'black',
    // borderRadius: '4px',
  };

const delButtonStyle: React.CSSProperties = {
    backgroundColor: '#ff9999',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '9px',
    cursor: 'pointer',
  };

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#82c8e6',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '9px',
    cursor: 'pointer',
  };
export default Table;