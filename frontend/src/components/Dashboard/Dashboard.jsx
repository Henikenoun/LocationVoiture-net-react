import React, { useState, useContext } from "react";
import "./Dashboard.css"; 
import Table_User from "./Table_User"; 
import Table_Car from "../manager/Table_Car"; 
import Table_Rent from "./Table_Rent"; 
import { AuthContext } from "../auth/AuthContext";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); 
  const [selectedMenu, setSelectedMenu] = useState("Users"); 
  const { user } = useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? "⟨" : "☰"}
        </button>
        {isSidebarOpen && (
          <>
            <h2>LOCAVO</h2>
            <ul>
              {user && user.role === "admin" && (
                <li onClick={() => handleMenuClick("Users")}>Users</li>
              )}
              {user && user.role === "admin" && (
              <li onClick={() => handleMenuClick("Cars")}>Cars</li>)}
              {user && user.role === "admin" && (
              <li onClick={() => handleMenuClick("Rents")}>Rents</li>)}
            </ul>
          </>
        )}
      </div>
      {/* Main Content */}
      <div className="main-content">
        {selectedMenu === "Users" && <Table_User />} 
        {selectedMenu === "Cars" && <Table_Car />} 
        {selectedMenu === "Rents" && <Table_Rent />} 
      </div>
    </div>
  );
};

export default Dashboard;