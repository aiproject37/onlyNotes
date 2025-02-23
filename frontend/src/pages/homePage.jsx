import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigation hook
import { UserCircle, Search, LogOut } from "lucide-react";
import axios from "axios";
import Editor from "../components/editor"; // Editor Component
import Sidebar from "../components/sidebar"; // Sidebar Component

const HomePage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState({ username: "", email: "" });
  const [profileOpen, setProfileOpen] = useState(false); // Toggle Profile Section
  const token = localStorage.getItem("jwtToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (selectedFile) {
        await axios.put(`http://127.0.0.1:8000/api/notes/${selectedFile.id}/`, noteData, { headers });

      } else {
        const response = await axios.post("http://127.0.0.1:8000/api/notes/", noteData, { headers });
        setSelectedFile(response.data); // Set new note after creation
      }
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };
  
  
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
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetchUserData(token);
      fetchNotes();
    }
  }, [navigate]);

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

  const handleUpdateNote = async (id, updatedContent) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/notes/${id}/`, updatedContent, { headers });
      fetchNotes();  // Re-fetch the latest notes
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  
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
    <div className="flex h-screen bg-gray-50">
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
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">onlyNotes</h1>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            

            {/* Profile Button */}
            <button onClick={() => setProfileOpen(!profileOpen)} className="p-2 rounded-full bg-gray-200">
              <UserCircle className="text-gray-600 h-8 w-8" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-1">
          {/* Note Editor (Middle Section) */}
          <div className="flex-1 p-4">
        {selectedFile ? (
          <Editor  key={selectedFile.id} file={selectedFile}  onUpdateContent={handleUpdateNote} />
        ) : (
          <p className="text-gray-500">Select a file to start editing...</p>
        )}
      </div>

          {/* Profile Section (Right Side) */}
          {profileOpen && (
            <div className="w-64 bg-white shadow-md p-6 absolute right-0 top-16">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full  flex items-center justify-center">
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
