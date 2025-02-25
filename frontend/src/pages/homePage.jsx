import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigation hook
import { UserCircle, LogOut } from "lucide-react";
import axios from "axios";
import Editor from "../components/editor"; // Editor Component
import Sidebar from "../components/sidebar"; // Sidebar Component

const HomePage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [user, setUser] = useState({ username: "", email: "" });
  const [profileOpen, setProfileOpen] = useState(false); // Toggle Profile Section
 
  const token = localStorage.getItem("jwtToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };


  // Fetch User Data
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/details/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser({
          username: response.data.name,
          email: response.data.email,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData(token);
      fetchNotes();
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/logout/");

      if (response.status === 200) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        alert(response.data.error || "An error occurred during logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An unexpected error occurred");
    }
  };

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/notes/", { headers });
      setFiles(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
      console.error("Error fetching notes:", error);
    }
  };

  // Handle Add Note
  const handleAddNote = async () => {
    try {
      const newNote = { 
        title: "Untitled Note", 
        content: "",
        user: user // Fetch userId from localStorage or state if needed
      };
      const response = await axios.post("http://127.0.0.1:8000/api/notes/", newNote, { headers });
      setFiles([...files, response.data]);
      setSelectedFile(response.data);
    } catch (error) {
      console.error("Error creating note:", error);
      console.error("Server response:", error.response?.data);
    }
  };

  // Handle Update Note
  const handleUpdateNote = async (id, updatedContent) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/notes/${id}/`, updatedContent, { headers });
      fetchNotes();  // Re-fetch the latest notes
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  
  // Handle Delete Note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notes/${id}/`, { headers });
      setFiles((prev) => prev.filter((file) => file.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-rethink-sans text-lg">
      {/* Sidebar */}
      <Sidebar
        files={files}
        setFiles={setFiles}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onSelectFile={setSelectedFile}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className= "bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">onlyNotes</h1>

          <span className="font-bold text-gray-400 text-lg">{selectedFile.title}</span>

          {/* Right Side */}
          <div className="flex items-center gap-4">
           

            {/* Profile Button */}
            <button onClick={() => setProfileOpen(!profileOpen)} className="p-2 rounded-full hover:bg-gray-200">
              <UserCircle className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Note Editor (Middle Section) */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedFile ? (
              <Editor key={selectedFile.id} file={selectedFile} onUpdateContent={handleUpdateNote} />
            ) : (
              <p className="text-center text-gray-500">Select a file to start editing...</p>
            )}
          </div>

          {/* Profile Section (Right Side) */}
          {profileOpen && (
            <div className="w-64  bg-white shadow-md p-6 border-l  border-gray-200">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full flex items-center justify-center">
                  <UserCircle className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.username || "Loading..."}</h3>
                  <p className="text-sm text-gray-500">{user.email || "Loading..."}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;