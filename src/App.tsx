import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Navbar from './Navbar';
import NavbarAdmin from './NavbarAdmin';
import HomePage from './HomePage';
import VolunteeringPosts from './VolunteeringPosts';
import AddPostForm from './AddPostForm'


const App: React.FC = () => {
  
  const [logged_user, setLoggeduser] = useState('')
  return (
    <Router>
      <div>
        <Navbar />
        {/* <NavbarAdmin /> */}
        <Routes>
          <Route path="/" element={<VolunteeringPosts />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/addpost" element={<AddPostForm />} /> 
          {/* <Route path="/" element={<Navigate to="/home" />} /> */}
          
        </Routes>
      </div>
      {/* <div>
        <VolunteeringPosts/>
      </div> */}
    </Router>
  );
};

export default App;