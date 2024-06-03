import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import VolunteeringPosts from './VolunteeringPosts';

const NavbarAdmin: React.FC = () => {
  const location = useLocation();

  // Check if the current route is the home page (/home)
  const isHomePage = location.pathname === '/home';

  return (
    <nav style={{background: '#ff3d3d', textAlign: 'right', justifyContent: 'right', display: 'flex'}}>
      <table>
      <tr style={{padding: '7px'}}>
        {/* <td style={{padding: '7px'}} ><Link to="/signup">הרשמה</Link></td> */}  
        <td style={{padding: '7px', color: 'white'}} ><Link to="/userlist">משתמשים</Link></td>

      </tr>
      </table>
    </nav>
  );
};

export default NavbarAdmin;