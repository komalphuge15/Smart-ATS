import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-lg mt-2 text-gray-700">Oops! The page you're looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">Go Home</Link>
    </div>
  );
};

export default NotFound;
