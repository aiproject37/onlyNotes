import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://onlynotes.up.railway.app/api",
  withCredentials: true,
});

const RegisterPage = () => {
  const [showPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [tc, setTc] = useState(false); // Terms and Conditions
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Added success state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !name || !tc || !password || !password2) {
      setError("Please fill in all fields and agree to the terms.");
      return;
    }

    if (password !== password2) {
      setError("Passwords must match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/register/", {
        email,
        name,
        tc,
        password,
        password2,
      });

      console.log(response.data); // Log the response for debugging
      setError(''); // Clear any existing errors
      setSuccess("Registration successful! Redirecting to login...");

      // Redirect to login page after a delay
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Registration failed:", err.response || err);
      setSuccess(''); // Clear any existing success message
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please ensure all fields are correct."
      );
    }
  };

  return (
    <main className="min-h-screen font-rethink-sans bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <section className="relative bg-black lg:w-2/5 p-6 lg:p-12 text-gray-500">
          {/* Left section content remains the same */}
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
              "onlyNotes is an open-source note-taking app where you can create and
              collaborate on notes in real-time."
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

            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}
            
            {success && (
              <p className="text-green-500 text-center mb-4">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rest of the form content remains the same */}
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
                  htmlFor="name"
                  className="block text-sm font-medium font-['Rethink_Sans'] text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="eg: user123"
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
                    placeholder="Choose a strong password"
                    className="w-full p-4 font-['Rethink_Sans'] border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                             placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-black transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium font-['Rethink_Sans'] text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password2"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full p-4 font-['Rethink_Sans'] border-2 border-black rounded-xl text-gray-800 text-base lg:text-lg 
                             placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-black transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center space-x-2 text-sm font-medium font-['Rethink_Sans'] text-gray-700">
                  <input
                    type="checkbox"
                    checked={tc}
                    onChange={(e) => setTc(e.target.checked)}
                    className="form-checkbox border-2 border-black rounded focus:ring-black"
                  />
                  <span>I accept the terms and conditions</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full font-['Rethink_Sans'] p-4 bg-black text-white text-base lg:text-lg font-bold rounded-xl
                         hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-black transition-all duration-200"
              >
                Register
              </button>
            </form>

            <footer className="text-center mt-8">
              <p className="text-black text-base lg:text-lg font-medium font-['Rethink_Sans']">
                Already have an account?{' '}
                <a
                  href="/"
                  className="text-green-600 font-['Rethink_Sans'] font-bold hover:text-green-700 
                           underline decoration-2 underline-offset-2"
                >
                  Log In
                </a>
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;