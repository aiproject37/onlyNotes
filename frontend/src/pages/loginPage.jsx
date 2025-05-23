import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://onlynotes.up.railway.app/api",
    withCredentials: true, 
  });

const LoginPage = () => {
  const [showPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login/", {
        email,
        password,
      });

      console.log(response.data); 

      const { access } = response.data;

      if (access) {
       
        localStorage.setItem("jwtToken", access);

        navigate("/home");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login failed:", err.response || err);
      setError(err.response?.data?.errors?.non_field_errors?.[0] || "Invalid login credentials.");
    }
  };

  return (
    <main className="min-h-screen font-rethink-sans bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium font-['Rethink_Sans'] text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-4 border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                           placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-black transition-all duration-200 font-['Rethink_Sans']"
                  required
                />
              </div>

              <div className="relative">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium font-['Rethink_Sans'] text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-4 font-['Rethink_Sans'] border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                             placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-black transition-all duration-200"
                    required
                  />
                  
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-['Rethink_Sans'] p-4 bg-black text-white text-base lg:text-lg font-bold rounded-xl
                         hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-black transition-all duration-200"
              >
                Login
              </button>

              <div className="text-center">
                <a
                  href="/forgot-password"
                  className="text-red-600 font-['Rethink_Sans'] text-base lg:text-lg font-medium hover:text-red-700 
                           underline decoration-2 underline-offset-2"
                >
                  Forgot password?
                </a>
              </div>
            </form>

            <footer className="text-center mt-8">
              <p className="text-black text-base lg:text-lg font-medium font-['Rethink_Sans']">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-green-600 font-['Rethink_Sans'] font-bold hover:text-green-700 
                           underline decoration-2 underline-offset-2"
                >
                  Sign up
                </a>
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage