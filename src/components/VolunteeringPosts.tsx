import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import loading_img from '../loading.gif'
import { UserContext } from '../context/UserContext';
import AddPost from './Modal/AddPost';
import ConfirmPostDelete from './Modal/ConfirmPostDelete';
import EditPost from './Modal/EditPost';

const VolunteeringPosts: React.FC = () => {
  interface PostData {
    description: string;
    date_of_start: string;
    date_of_finish: string;
    times: string;
    };
    
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [displayedPhoneNumber, setDisplayedPhoneNumber] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null); // New state variable
  const userContext = useContext(UserContext);
  
  if (!userContext) {
    throw new Error("SignUpForm must be used within a UserProvider");
  }
  
  const { token , setToken } = userContext;
  
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("admin"));

  const [myId, setMyId] = useState(localStorage.getItem("user_id"));

  // _______________________________MODALS / POP UPS________________________________
 
  //    !!!!!!!!!!!!!!!!! add post pop up !!!!!!!!!!!!!!!!!!!
  const [isAddPostOpen, setAddPostOpen] = useState<boolean>(false);
  const [addPostData, setAddPostData] = useState<PostData | null>(null);
  
  const handleOpenAddPost = () => {
    setAddPostOpen(true);
  };

  const handleCloseAddPostModal = () => {
    setAddPostOpen(false);
  };

  const handlePostFormSubmit = (data: PostData): void => {
    setAddPostData(data);
    handleCloseAddPostModal();
  };


  //  !!!!!!!!!!!!!!!!! delete post pop up  !!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [isConfirmDeletePostOpen, setConfirmDeletePostOpen] = useState<boolean>(false);

  const handleOpenConfirmDeletePost = (post_id: string) => {
    localStorage.setItem("url", '/');
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


  //  !!!!!!!!!!!!!!!!! edit post pop up  !!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [isEditPostOpen, setEditPostOpen] = useState<boolean>(false);

  const handleOpenEditPost = (post_id: string) => {
    localStorage.setItem("url", '/');
    localStorage.setItem("selected_post", post_id);
    setEditPostOpen(true);
  };

  const handleCloseEditPostModal = () => {
    localStorage.removeItem("selected_post");
    localStorage.removeItem("url");
    setEditPostOpen(false);
  };
  
  const handleEditPostFormSubmit = (): void => {
    handleCloseEditPostModal();
  };


  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      // console.log(response);
      if (response.status == 200)
      {
        setPosts(response.data);
        console.log(posts);
        // if (posts.length == 0 )
        // {
        //   setPosts([]);
        // }  
      }

    } catch (error) {
      setError(''+error);
    } finally {
      setLoading(false);
    }
  }

  const showPhoneNumber = (phoneNumber: string, index: number) => { // Modified to take index
    setDisplayedPhoneNumber(phoneNumber);
    setSelectedRow(index); // Set the selected row index
  }

  return (
    <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
      <h2>מודעות חיפוש מתנדבים</h2>
      
      {/* ERROR MESSAGE */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/*  LOADING GIF */}
      {loading && <center><div><img src={loading_img} style={{ width: '15%', alignSelf: 'center'}}/></div></center>}
      
      {/*   POSTS TABLE */}
      {!loading && (posts.length>0) && (
        <center>
        <table style={{ borderCollapse: 'collapse', margin: '5px', display: 'inline-block', width: '70%' }}>
        <thead>
          <tr style={{ border: '2px solid black' }}>
            {isAdmin && <th style={thStyle}> מחק</th>}
            {isAdmin && <th style={thStyle}> ערוך</th>}
            <th style={thStyle}>צור קשר</th>
            <th style={thStyle}>כתובת</th>
            <th style={thStyle}>שעות התנדבות</th>
            <th style={thStyle}>תאריך סיום</th>
            <th style={thStyle}>תאריך התחלה</th>
            <th style={thStyle}>תיאור</th>
            <th style={thStyle}>ארגון</th>
          </tr>
        </thead>
          
        <tbody>
          {posts.map((post, index) => (
            <tr key={index} style={{ textAlign: 'right', border: '2px solid black', backgroundColor: selectedRow === index ? 'lightblue' : 'white' }}> {/* Apply background color based on selectedRow */}
              
              {isAdmin &&<td style={tdStyle}>
              <button style={delButtonStyle}
                          onClick={() =>handleOpenConfirmDeletePost(post["id"])}> מחק</button>
                </td>}
              {isAdmin &&<td style={tdStyle}>
              <button 
              style={buttonStyle}
                          onClick={() =>handleOpenEditPost(post["id"])}
                          > ערוך</button>
                </td>}


              <td style={tdStyle}>
                {(displayedPhoneNumber !== post["phone_number"] || selectedRow !== index) &&(
                  <button style={buttonStyle} onClick={() => showPhoneNumber(post["phone_number"], index)}> {/* Pass index to showPhoneNumber */}
                    הצג טלפון
                  </button>
                )}
                {displayedPhoneNumber === post["phone_number"] && selectedRow === index && (
                  <div>{post["contact_first_name"]}<br/>{post["phone_number"]}</div>
                )}
              </td>
              <td style={tdStyle}>{post["address"]}</td>
              <td style={tdStyle}>{post["times"]}</td>
              <td style={tdStyle}>{post["date_of_finish"]}</td>
              <td style={tdStyle}>{post["date_of_start"]}</td>
              <td style={tdStyle}>{post["description"]}</td>
              {post["owner_id"]!==myId && <td style={tdStyle}> <a href={`/user/${post["owner_id"]}`}>{post["organization_name"]}</a></td>}
              {post["owner_id"]==myId && <td style={tdStyle}> <a href={`/profile`}>{post["organization_name"]}</a></td>}
              
              {/* if you click on your own organization -> redirect to /profile */}
              {/* {post["owner_id"]===} */}
            </tr>
          ))}
        </tbody>
      </table>
      </center>
      )}

      {/*   NO POSTS MSG */}
      {!loading && !posts.length && <div><h3>אין פוסטים רשומים במערכת</h3></div>}
      
      {/*  ADD POST BUTTON */}
      {!isAdmin && !loading && token &&<button style={buttonStyle}
                          onClick={handleOpenAddPost}>פרסם פוסט</button>}

      
      {/* add post modal */}
      {addPostData && (
        <center>
        <div className="msg-box">
        מודעה פורסמה בהצלחה
        </div>
        </center>
      )}

      {isAddPostOpen && <AddPost
        isOpen={true}
        onSubmit={handlePostFormSubmit}
        onClose={handleCloseAddPostModal} />}

      {isConfirmDeletePostOpen && <ConfirmPostDelete
        isOpen={true}
        onSubmit={handleConfirmDeletePostFormSubmit}
        onClose={handleCloseConfirmDeletePostModal} />}

      {isEditPostOpen && <EditPost
        isOpen={true}
        onSubmit={handleEditPostFormSubmit}
        onClose={handleCloseEditPostModal} />}
        

    </div>
  );
}

export default VolunteeringPosts;


const tdStyle: React.CSSProperties = {
  // border: '1px solid black',
  textAlign: 'center',
  padding: '8px 12px',
  // borderRadius: '4px',
  // width:'10%',
};

const thStyle: React.CSSProperties = {
  // border: '1px solid black',
  textAlign: 'center',
  padding: '8px 12px',

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