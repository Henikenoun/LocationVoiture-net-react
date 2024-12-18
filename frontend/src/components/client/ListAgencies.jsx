import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ListAgencies.css"; // Import a CSS file for custom styles

const ListAgencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get("http://localhost:5074/api/Agence", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAgencies(response.data);
      } catch (error) {
        console.error("Error fetching agencies:", error);
        setError("Failed to fetch agencies. Please try again later.");
      }
    };

    fetchAgencies();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div style={{minHeight:'50vh'}}>
      <div className="agencies-container" >
        {agencies.map((agency) => (
          <div key={agency.id} className="agency-card">
            <h2>{agency.nom}</h2>
            <p>{agency.adresse}</p>
            <p>{agency.tel}</p>
            <Link to={`/agencies/${agency.id}/cars`} className="btn">
              View Cars
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAgencies;