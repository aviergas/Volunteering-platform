import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import VolunteeringPosts from './VolunteeringPosts';

const Navbar: React.FC = () => {
  const location = useLocation();

  // Check if the current route is the home page (/home)
  const isHomePage = location.pathname === '/home';

  return (
    <nav style={{background: '#1DA1F2', textAlign: 'right', justifyContent: 'right', display: 'flex'}}>
      <table>
      <thead>
      <tr style={{padding: '7px'}}>
          <td style={{padding: '7px'}} ><Link to="/addpost">העלה פוסט</Link></td>
          <td style={{padding: '7px'}} ><Link to="/signup">הרשמה</Link></td>
          <td style={{padding: '7px'}} ><Link to="/login">התחברות</Link></td>
          <td style={{padding: '7px'}} ><Link to="/">דף בית</Link></td>
        </tr>
      </thead>
      </table>
    </nav>
  );
};

export default Navbar;