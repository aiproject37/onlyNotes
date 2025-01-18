import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("jwtToken");

  // If no token, redirect to login page
  if (!token) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/" />;
  }

  // If token exists, render the protected route (children)
  return children;
};

export default ProtectedRoute;