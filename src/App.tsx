import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import AddPostForm from './components/AddPostForm';

import Navbar from './components/Navbar';
import NavbarUser from './components/NavbarUser';
import NavbarAdmin from './components/NavbarAdmin';

import UserList from './components/UserList';
import VolunteeringPosts from './components/VolunteeringPosts';

import Profile from './components/Profile';

import { UserContext } from './context/UserContext';
import Modal from './components/Modal/Modal';
import AdminList from './components/AdminList';
import OtherUserProfile from './components/OtherUserProfile';
// import { AdminContext } from './context/AdminContext';



const App: React.FC = () => {

  const userContext = useContext(UserContext);
  
  if (!userContext) {
    throw new Error("SignUpForm must be used within a UserProvider");
  }
  
  const { token , setToken } = userContext;

  
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("admin"));
  
  useEffect(() => {
    // Function to update isAdmin state based on localStorage
    const updateAdminFromLocalStorage = () => {
      setIsAdmin(localStorage.getItem("admin"));
    };

    // Call the function initially to set the state
    updateAdminFromLocalStorage();

    // Set up a listener to update isAdmin if localStorage changes
    const handleStorageChange = () => {
      updateAdminFromLocalStorage();
    };

    // Attach the listener to the window's storage event
    window.addEventListener('storage', handleStorageChange);

    // Clean up by removing the listener when component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <Router>
      <div>
      
        <Navbar />
        {token && !isAdmin && <NavbarUser/>}
        <Modal isOpen={false} children={undefined}/>
        {token && isAdmin && <NavbarAdmin/>}
        <Routes >
          <Route path="/" element={<VolunteeringPosts />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          
          <Route path="/addpost" element={<AddPostForm />} />
          <Route path="/userlist" element={<UserList />} />      
          <Route path="/adminlist" element={<AdminList />} />      
          <Route path="/profile" element={<Profile />} />      
          <Route path="user/:id" element={<OtherUserProfile />} />   
        </Routes>
      </div>
    </Router>
  );
};

export default App;