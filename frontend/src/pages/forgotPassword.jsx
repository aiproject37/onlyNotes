import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true, 
  });

  // Step 1: Send email to get OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please fill out the email field.");
      return;
    }

    try {
      const response = await axiosInstance.post('/user/send-otp/', { 
        email: email  // Just send email
      });
      
      if (response.status === 200) {
        setOtpSent(true);
        setError('');
        setSuccessMessage('OTP sent to your email. Please check your inbox.');
        // Email is now stored in state and will be available for next steps
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('User not found. Please check your email.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    try {
      const response = await axiosInstance.post('/user/verify-otp/', { 
        email: email,  // Use email from state
        otp: otpCode   // Send OTP
      });
      
      if (response.status === 200) {
        setOtpVerified(true);
        setSuccessMessage('OTP verified successfully! You can now reset your password.');
        setError('');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError('Invalid or expired OTP. Please try again.');
      } else {
        setError('An error occurred during OTP verification. Please try again later.');
      }
    }
  };
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
  
    // Validate input: Allow only digits and one character per input
    if (!/^\d$/.test(value) && value !== "") {
      return;
    }
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    // Automatically focus on the next input field
    if (value !== "" && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        const previousInput = document.getElementById(`otp-${index - 1}`);
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  };
    

  // Step 3: Reset Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    if (!newPassword || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await axiosInstance.post('user/reset-password/', {
        email: email,              // Use email from state
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      if (response.status === 200) {
        setSuccessMessage('Your password has been successfully changed.');
        setError('');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError('Passwords do not match.');
      } else if (err.response?.status === 404) {
        setError('User not found.');
      } else {
        setError('An error occurred during password reset. Please try again later.');
      }
    }
  };

  return (
    <main className="min-h-screen bg-white font-rethink-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side Section */}
        <section className="relative bg-black lg:w-2/5 p-6 lg:p-12 text-gray-500">
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <div className="w-full max-w-md mb-6 lg:mb-8">
              <img
                className="w-full h-auto object-contain"
                src="/illustration.png"
                alt="Welcome illustration"
                loading="eager"
              />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 lg:mb-8">
              Your digital notes companion is now here.
            </h1>
            <p className="text-base md:text-lg text-center max-w-prose">
              "onlyNotes is an open-source note taking app where you can create and
              collaborate on notes in real-time".
            </p>
          </div>
        </section>

        {/* Right Side Section */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <header className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold font-['Rethink_Sans'] mb-2">
                onlyNotes
              </h2>
              <p className="text-gray-500 text-base lg:text-lg font-medium font-['Rethink_Sans']">
                create · collaborate · real-time
              </p>
            </header>

            {/* Step 1: Email Form */}
            {!otpSent ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-center">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <span className="font-medium text-center">Please enter your registered email to receive an OTP.</span>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email"
                    className="w-full p-4 border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                              placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                              focus:ring-black transition-all duration-200 font-['Rethink_Sans']"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-4 bg-black text-white text-base lg:text-lg font-bold rounded-xl
                           hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-black transition-all duration-200"
                >
                  Get OTP
                </button>
              </form>
            ) : !otpVerified ? (
              // Step 2: OTP Form
              <form onSubmit={handleOtpSubmit} className="space-y-6 text-center">
                <span className="font-medium text-center mb-4">Enter the six digit OTP you just received. OTP expires in two minutes.</span>

                {/* OTP Input Fields */}
                <div className="flex justify-between mb-4">
                  {otp.map((digit, index) => (
                    <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength="1"
                    className="w-16 h-16 border-2 border-black rounded-lg text-center text-xl font-bold focus:outline-none"
                  />
                  
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full p-4 bg-black text-white text-base lg:text-lg font-bold rounded-xl
                           hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-black transition-all duration-200"
                >
                  Verify OTP
                </button>
              </form>
            ) : (
              // Step 3: Password Change Form
              <form onSubmit={handlePasswordChange} className="space-y-6 text-center">
                <span className="font-medium text-center mb-4">Please enter a new password.</span>

                <div className="relative">
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full p-4 border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                              placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                              focus:ring-black transition-all duration-200 font-['Rethink_Sans']"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full p-4 border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                              placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                              focus:ring-black transition-all duration-200 font-['Rethink_Sans']"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-4 bg-black text-white text-base lg:text-lg font-bold rounded-xl
                           hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-black transition-all duration-200"
                >
                  Change Password
                </button>
              </form>
            )}

            {error && <div className="mt-4 font-medium text-center text-red-500 text-sm">{error}</div>}
            {successMessage && <div className="mt-4 font-medium text-center text-green-500 text-sm">{successMessage}</div>}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;