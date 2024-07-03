import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
// import 'bulma/css/bulma.min.css';
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import AddAdmin from "./Modal/AddAdmin";
import ConfirmProfileDelete from "./Modal/ConfirmProfileDelete";
import EditAdmin from "./Modal/EditAdmin";

const AdminList = () => {
  
  
  interface User {
        id: string;
        email: string;
        password: string;
    }

  const user: User = {
        id: "",
        email: "",
        password: "",
        // other properties
    };

  const userContext = useContext(UserContext);

  if (!userContext) {
      throw new Error("SignUpForm must be used within a UserProvider");
    }

  const { token , setToken } = userContext;
  
    const [myId, setMyId] = useState<string|null>(localStorage.getItem("user_id"));
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);


  const getUsers = async () => {
    setLoading(true);
    // setError('');
    try {
      setLoading(true);


      
  const response = await axios.get('http://127.0.0.1:8000/api/users/admins/');
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
    // console.log(myId);

  }, []);


  //      add admin pop up !!!!!!!!!!!!
  const [isAddAdminOpen, setAddAdminOpen] = useState<boolean>(false);
  const [addAdminData, setAddAdminData] = useState<User | null>(null);
  
  const handleOpenAddAdmin = () => {
    console.log("clickecyclack");
    setAddAdminOpen(true);
  };

  const handleCloseAddAdminModal = () => {
    setAddAdminOpen(false);
  };

  const handleAdminFormSubmit = (data: User): void => {
    setAddAdminData(data);
    handleCloseAddAdminModal();
  };


  //      edit admin pop up !!!!!!!!!!!!
  const [isEditAdminOpen, setEditAdminOpen] = useState<boolean>(false);
  const [editAdminData, setEditAdminData] = useState<User | null>(null);
  
  const handleOpenEditAdmin = (selected_id: string) => {
    localStorage.setItem("selected_user_id", selected_id);
    // console.log("clickecyclack");
    setEditAdminOpen(true);
  };

  const handleCloseEditAdminModal = () => {
    localStorage.removeItem("selected_user_id");
    setEditAdminOpen(false);
  };

  const handleEditAdminFormSubmit = (data: User): void => {
    setEditAdminData(data);
    handleCloseEditAdminModal();
  };



  
  //    delete admin pop up !!!!!!!!!!!!!!!!!!!
  const [isConfirmDeleteProfileOpen, setConfirmDeleteProfileOpen] = useState<boolean>(false);

  const handleOpenConfirmDeleteProfile = (email: string) => {
    localStorage.setItem("url", '/adminlist');
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
  

  return (
    <div>
    <center>
    <br/>
    {/* <button
     className="button mb-5 is-primary"
     onClick={()=> setActivePop(true)}>
        Create
    </button><br/> */}
    </center>
    {!loading && users.length==0 && (<center><h2>אין מנהלים רשומים במערכת</h2></center>)}


    {isAddAdminOpen && <AddAdmin
        isOpen={true}
        onSubmit={handleAdminFormSubmit}
        onClose={handleCloseAddAdminModal} />
    }
{/* 
    {!loading && token && (
      <center><h2>משתמש מחובר : </h2><h2>{myId}</h2></center>
    )} */}

    {!loading && users.length>0 && <center>
        <table style={{ borderCollapse: 'collapse', margin: '5px', display: 'inline-block', width: '80%'}}>
        <thead>

        {users.length>1 &&<th style={thStyle}>מחק</th>}
          <th style={thStyle}>ערוך</th>            
            <th style={thStyle}>סיסמא</th>
            <th style={thStyle}>מייל</th>
            <th style={thStyle}>ID</th>
        </thead>
          
        <tbody>
          {users.map((user, index) => (
            
            
            <tr key={index} style={{ textAlign: 'right', border: '2px solid black'}}>
              
              
              {users.length>1 &&
                <td style={tdStyle}>
                <button 
                onClick={()=>handleOpenConfirmDeleteProfile(user["email"])}
                className="button mr-2 is-danger is-light" 
                style={delButtonStyle}
                >מחק</button>
              </td>
              }
              {user.id==myId && 
              <td style={tdStyle}>
                <button 
                onClick={()=>handleOpenEditAdmin(user["id"])}
                className="button mr-2 is-info is-light"
                style={buttonStyle}
                >ערוך</button>
              </td>
              } 
              {user.id!==myId && 
              <td style={tdStyle}>
              </td>
              } 
              <td style={tdStyle}><center>{user.password}</center></td>
              
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.id}</td>
            </tr>
          ))}
        </tbody>
      </table></center>
    }


    {!loading  && (
    <center>
    <button style={buttonStyle}
            onClick={() =>
              handleOpenAddAdmin()
            }>הוסף מנהל</button>
    </center>
    )}

    {isEditAdminOpen && <EditAdmin
      isOpen={true}
      onSubmit={handleEditAdminFormSubmit}
      onClose={handleCloseEditAdminModal}/>
    }  

    {isConfirmDeleteProfileOpen && <ConfirmProfileDelete
      isOpen={true}
      onSubmit={handleConfirmDeleteProfileFormSubmit}
      onClose={handleCloseConfirmDeleteProfileModal}/>
    }  

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
const buttonStyle: React.CSSProperties = {
    backgroundColor: '#82c8e6',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '9px',
    cursor: 'pointer',
  };
const delButtonStyle: React.CSSProperties = {
    backgroundColor: '#ff9999',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '9px',
    cursor: 'pointer',
  };
export default AdminList;