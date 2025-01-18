import React from 'react'
import LoginPage from './pages/loginPage'
import HomePage from './pages/homePage'
import RegisterPage from './pages/registrationPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/forgotPassword';
import ProtectedRoute from './components/protectedRoute';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
          path="/home"
          element={<ProtectedRoute><HomePage/></ProtectedRoute>}
        />
      
    </Routes>
  </Router>
  )
}

export default App