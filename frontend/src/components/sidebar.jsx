import React, { useState } from "react";
import { File, Plus, Trash2, Edit3 } from "lucide-react";
import axios from "axios";

const Sidebar = ({ files, setFiles, selectedFile, onSelectFile, onAddNote, onDeleteNote }) => {
  const [renaming, setRenaming] = useState(null);
  const [inputValue, setInputValue] = useState("");
  
  const token = localStorage.getItem("jwtToken");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const startRename = (id, name, e) => {
    e?.stopPropagation();
    setRenaming(id);
    setInputValue(name);
  };

  const saveRename = async (id) => {
    if (!inputValue.trim()) return;
    try {
      await axios.put(
        `https://onlynotes.up.railway.app/api/notes/${id}/`,
        { title: inputValue }, 
        { headers }
      );
      setFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, title: inputValue } : file))
      );
    } catch (error) {
      console.error("Error renaming note:", error);
    }
    setRenaming(null);
  };

  return (
    <div className="w-80 h-screen font-rethink-sans bg-gray-50 border-r flex flex-col">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <span className="text-xl font-bold text-gray-800">Private Notes</span>
        <button 
          onClick={onAddNote}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <File size={40} className="text-gray-400" />
            <p className="text-sm">No notes yet</p>
            <button 
              onClick={onAddNote}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-150
                  ${selectedFile?.id === file.id 
                    ? "bg-gray-200" 
                    : "hover:bg-gray-100"
                  }`}
                  onClick={() => onSelectFile(file)} 
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <File size={18} className="text-gray-400 flex-shrink-0" />
                  {renaming === file.id ? (
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => saveRename(file.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename(file.id)}
                      className="bg-white px-2 py-1 rounded w-full outline-none border border-gray-300"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="text-gray-700 font-medium truncate"
                      onDoubleClick={(e) => startRename(file.id, file.title, e)}
                    >
                      {file.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={(e) => startRename(file.id, file.title, e)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => onDeleteNote(file.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
