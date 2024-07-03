import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import user_logo from '../user.png'

const NavbarUser: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{background: '#0066cc', textAlign: 'right', justifyContent: 'right', display: 'flex'}}>
      <table>
      <tr style={{padding: '7px'}}>
        {/* <td style={{padding: '7px', color: 'white'}} ><Link to="/addpost">העלה פוסט</Link></td> */}
        <td style={{padding: '7px', alignSelf: 'center'}} ><Link to="/profile"><img src={user_logo} style={{ width: '20px', alignSelf: 'center'}}/> </Link></td>  

      </tr>
      </table>
    </nav>
  );
};

export default NavbarUser;