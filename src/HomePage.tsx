import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
        <Link to="/login">
        <button>SignOut</button>
      </Link>
      <h1>Welcome to the Homepage</h1>
      <p>This is your home page content.</p>

    </div>
  );
};

export default HomePage;