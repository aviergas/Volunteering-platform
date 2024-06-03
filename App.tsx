import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Navbar from './Navbar';
import HomePage from './HomePage';
import UserList from './UserList';
import VolunteeringPosts from './VolunteeringPosts';
import AddPostForm from './AddPostForm'
import NavbarAdmin from './NavbarAdmin';


const App: React.FC = () => {
  
  const [logged_user, setLoggeduser] = useState('')
  return (
    <Router>
      <div>
        <Navbar />
        {/* <NavbarAdmin/> */}
        <Routes >
          <Route path="/" element={<VolunteeringPosts />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/addpost" element={<AddPostForm />} />
          <Route path="/userlist" element={<UserList />} />           
        </Routes>
      </div>
    </Router>
  );
};

export default App;