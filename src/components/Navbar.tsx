import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar: React.FC = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("SignUpForm must be used within a UserProvider");
  }
  
  const { token ,setToken } = userContext;
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if(redirect) {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 300); // 300 milliseconds = 0.3 seconds

    return () => clearTimeout(timer); // Cleanup the timeout if the component is unmounted
  
}}, [redirect]);


  const log_out = () => {
    setToken(null);
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin");
  }

  // console.log("tokokokoktok = =  " + token)
  return (
    <nav style={{background: '#1DA1F2', textAlign: 'right', justifyContent: 'right', display: 'flex'}}>
      <table>
      <thead>
      <tr style={{padding: '7px'}}>
          {/* <td style={{padding: '7px'}} ><Link to="/posts/my">פוסטים שלי</Link></td> */}

          {/* <td style={{padding: '7px'}} ><Link to="/addpost">העלה פוסט</Link></td> */}
          
          
          {!token && <td style={{padding: '7px'}} ><Link to="/signup">הרשמה</Link></td>}
          {!token &&<td style={{padding: '7px'}} ><Link to="/login">התחברות</Link></td>}
          {token && <td style={{padding: '7px'}} onClick={log_out}> <Link to="/"> התנתק </Link></td>}
          <td style={{padding: '7px'}} ><Link to="/">דף בית</Link></td>
        
        </tr>
      </thead>
      </table>
    </nav>
  );
};

export default Navbar;


// {() => localStorage.removeItem("user_token")}