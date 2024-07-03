import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {UserContext} from '../context/UserContext';
import ProfileEdit from './Modal/EditUser'
import AddPost from './Modal/AddPost'
import ConfirmPostDelete from './Modal/ConfirmPostDelete'
import loading_img from '../loading.gif'
import EditPost from './Modal/EditPost';
import ConfirmProfileDelete from './Modal/ConfirmProfileDelete';

import {User} from '../interfaces/interfaces';

interface ProfileEditData {
    org_name: string;
    description: string;
    phone: string;
    site_url: string;
    first_name: string;
    last_name: string;
    email: string;
  };

interface PostData {
  description: string;
  date_of_start: string;
  date_of_finish: string;
  times: string;
  };
  

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState("");

  // context

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("SignUpForm must be used within a UserProvider");
  }

  const { token , setToken } = userContext;



// ___________________________PROFILE MODALS_______________________________________
  //  edit profile pop up
  const [isEditProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const [editProfileData, setEditProfileData] = useState<ProfileEditData | null>(null);
  
  const handleOpenProfileEditModal = (email:string) => {
    localStorage.setItem("email", email);
    localStorage.setItem("url", '/profile');
    setEditProfileOpen(true);
    // console.log(isEditProfileOpen)
  };

  const handleCloseProfileEditModal = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("url");
    setEditProfileOpen(false);
  };

  const handleFormSubmit = (data: ProfileEditData): void => {
    setEditProfileData(data);
    handleCloseProfileEditModal();
  };


  //  delete profile pop up
  const [isConfirmDeleteProfileOpen, setConfirmDeleteProfileOpen] = useState<boolean>(false);

  const handleOpenConfirmDeleteProfile = () => {
    localStorage.setItem("email", email);
    setConfirmDeleteProfileOpen(true);
  };

  const handleCloseConfirmDeleteProfileModal = () => {
    localStorage.removeItem("email");
    setConfirmDeleteProfileOpen(false);
  };
  
  const handleConfirmDeleteProfileFormSubmit = (): void => {
    handleCloseConfirmDeleteProfileModal();
  };

  


// ____________________________POST MODALS______________________________________
  //  add post pop up
  const [isAddPostOpen, setAddPostOpen] = useState<boolean>(false);
  const [addPostData, setAddPostData] = useState<PostData | null>(null);
  
  const handleOpenAddPost = () => {
    localStorage.setItem("url", '/profile');
    setAddPostOpen(true);
  };

  const handleCloseAddPostModal = () => {
    localStorage.removeItem("url");
    setAddPostOpen(false);
  };

  const handlePostFormSubmit = (data: PostData): void => {
    setAddPostData(data);
    handleCloseAddPostModal();
  };


  
  //  delete post pop up
  const [isConfirmDeletePostOpen, setConfirmDeletePostOpen] = useState<boolean>(false);

  const handleOpenConfirmDeletePost = (post_id: string) => {
    localStorage.setItem("url", '/profile');
    localStorage.setItem("selected_post", post_id);
    setConfirmDeletePostOpen(true);
  };

  const handleCloseConfirmDeletePostModal = () => {
    localStorage.removeItem("selected_post");
    localStorage.removeItem("url");
    setConfirmDeletePostOpen(false);
  };
  
  const handleConfirmDeletePostFormSubmit = (): void => {
    handleCloseConfirmDeletePostModal();
  };



  //  edit post pop up
  const [isEditPostOpen, setEditPostOpen] = useState<boolean>(false);
  const [editPostData, setEditPostData] = useState<PostData | null>(null);

  const handleEditDeletePost = (id : string) => {
    localStorage.setItem("selected_post", id);
    localStorage.setItem("url", '/profile');
    setEditPostOpen(true);
  };

  const handleCloseEditPostModal = () => {
    localStorage.removeItem("selected_post");
    localStorage.removeItem("url");
    setEditPostOpen(false);
  };

  const handleEditPostFormSubmit = (data: PostData): void => {
    setEditPostData(data);
    handleCloseEditPostModal();
  };
  

  useEffect(() => {
        const fetchUser = async () => {
          try {

            //    api/users/me
            const user_response = await axios.get("http://127.0.0.1:8000/api/users/me", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("api/users/me");
            console.log(user_response.data);
            setUser(user_response.data);
            setEmail(user_response.data.email);
            // setDescription(user_response.data.description);

            //      api/posts/my
            const posts_response = await axios.get("http://127.0.0.1:8000/api/posts/my", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            
        setPosts(posts_response.data);
        // console.log("postssss = ");
        // console.log(posts_response.data);

          } catch (error) {
            setError('Error fetching user data -> ' +error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, []);

      

    
      if (error) {
        return <center><div>{error}</div></center>;
      }
    
      if (!user) {
        return <div>No user data available</div>;
      }
    
      const num = user.posts
      return (
        <center>
        <div>
          <br/>
          <h1>{user.org_name}</h1>  
          <p style={{width: '25%'}}>{user.description}</p>
          <p><a href={user.site_url}>{user.site_url}</a></p>
          <p>{user.first_name} {user.last_name}</p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p><button style={buttonStyle}
                        onClick={()=>handleOpenProfileEditModal(user.email)}>ערוך פרטים אישיים</button>
          </p>
          <button style={delButtonStyle}
                        onClick={handleOpenConfirmDeleteProfile}>מחק משתמש</button>               
        </div>

        <br/>___________________________________________________________________________________________________________________________

      {loading && <center><div><img src={loading_img} style={{ width: '10%', alignSelf: 'center'}}/></div></center>}
      
      {/*  user posts table  */}
      {!loading && user.posts>0 && (   
      <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
      
      <h2>הפוסטים שלי </h2>
      <center>
      <table style={{ borderCollapse: 'collapse', margin: '5px', display: 'inline-block', width: '60%' }}>
        <thead>
          <tr style={{ border: '2px solid black' }}>
            <th style={thStyle}> מחק</th>
            <th style={thStyle}> ערוך</th>
            <th style={thStyle}>צור קשר</th>
            <th style={thStyle}>כתובת</th>
            <th style={thStyle}>שעות התנדבות</th>
            <th style={thStyle}>תאריך סיום</th>
            <th style={thStyle}>תאריך התחלה</th>
            <th style={thStyle}>תיאור</th>
            {/* <th style={thStyle}>ארגון</th> */}
          </tr>
        </thead>
          
        <tbody>
          {posts.map((post, index) => (
            <tr key={index} style={{ textAlign: 'right', border: '2px solid black' }}> 
              
              {/* delete button */}
              <td style={tdStyle}>
                <center>
                  <button style={delButtonStyle} 
                          onClick={() =>
                          // deletePost(post["id"])
                          handleOpenConfirmDeletePost(post["id"])
                          }>מחק</button>
                </center>
              </td>
              
              {/* edit POST button */}
              <td style={tdStyle}>
                <center>
                  <button style={buttonStyle} 
                          onClick={() =>
                          handleEditDeletePost(post["id"])
                          }>ערוך</button>
                </center>
              </td>

              <td style={tdStyle}>
                <div>{post["contact_first_name"]}<br/>{post["phone_number"]}</div>
              </td>
              <td style={tdStyle}>{post["address"]}</td>
              <td style={tdStyle}>{post["times"]}</td>
              <td style={tdStyle}>{post["date_of_finish"]}</td>
              <td style={tdStyle}>{post["date_of_start"]}</td>
              <td style={tdStyle}>{post["description"]}</td>
              {/* <td style={tdStyle}>{post["organization_name"]}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      </center>
      </div>)}
      
      {!loading && user.posts===0 && <h1>אין לך פוסטים במערכת</h1>}
        
      <br/>
      {!loading && <button style={buttonStyle}
                          onClick={handleOpenAddPost}>פרסם פוסט</button>}

      
      {/* add post modal */}
      {addPostData && (
        <div className="msg-box">
        פוסט פורסם בהצלחה
        </div>
      )}

      {isAddPostOpen && <AddPost
        isOpen={true}
        onSubmit={handlePostFormSubmit}
        onClose={handleCloseAddPostModal} />}




      {/* edit profile modal */}
      {editProfileData && editProfileData.email && (
        <div className="msg-box">
          <b>{editProfileData.email}</b> פרטי משתמש עודכנו בהצלחה
        </div>
      )}
    
      {isEditProfileOpen && <ProfileEdit
        isOpen={true}
        onSubmit={handleFormSubmit}
        onClose={handleCloseProfileEditModal} />}

      {/* delete PROFILE pop up */}
      {isConfirmDeleteProfileOpen && <ConfirmProfileDelete
        isOpen={true}
        onSubmit={handleConfirmDeleteProfileFormSubmit}
        onClose={handleCloseConfirmDeleteProfileModal}/>}


      {/* delete POST modal */}
      {isConfirmDeletePostOpen && <ConfirmPostDelete
        isOpen={true}
        onSubmit={handleConfirmDeletePostFormSubmit}
        onClose={handleCloseConfirmDeletePostModal} />}


      {/* edit POST pop up */}
      {isEditPostOpen && <EditPost
        isOpen={true}
        onSubmit={handleEditPostFormSubmit}
        onClose={handleCloseEditPostModal}/>}




      </center>
      );
    };
    

export default Profile;




const tdStyle: React.CSSProperties = {
  border: '1px solid black',
  textAlign: 'center',
  padding: '8px 12px'
  // borderRadius: '4px',
};

const thStyle: React.CSSProperties = {
  border: '1px solid black',
  textAlign: 'center',
  padding: '8px 12px'

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
