import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClientLocations.css"; // Ensure the CSS file is imported correctly

const ClientLocations = () => {
  const [locations, setLocations] = useState([]);
  const [paidLocations, setPaidLocations] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5074/api/Location", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(response.data);

        const paidResponse = await axios.get("http://localhost:5074/api/Paiement", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaidLocations(paidResponse.data.map(p => p.locationId));

        const agenciesResponse = await axios.get("http://localhost:5074/api/Agence", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgencies(agenciesResponse.data);
      } catch (err) {
        setError("Impossible de récupérer les locations.");
      }
    };

    fetchLocations();
  }, []);

  const getCarImageUrl = (voitureId) => {
    if (!agencies || agencies.length === 0) return null;
    for (const agency of agencies) {
        // console.log(agency)

        if (agency.voitures) {
            const car = agency.voitures.find(car => car.id === voitureId);

        if (car) {
          return car.imageUrl;
        }
      }
    }
    return null;
  };

  const handlePay = (location) => {
    navigate(`/payment/${location.idLocation}`, { state: { location } });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5074/api/Location/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(locations.filter(location => location.idLocation !== id));
    } catch (err) {
      setError("Erreur lors de la suppression de la location.");
    }
  };

  return (
    <div className="client-locations">
      <h2>Mes Locations</h2>
      {error && <p className="error">{error}</p>}
      <div className="locations-list">
        {locations.map((location) => (
          <div key={location.idLocation} className="location-card">
            {/* Displaying the image URL */}
            {getCarImageUrl(location.voitureId) && (
              <img
                src={getCarImageUrl(location.voitureId)}
                alt={`Voiture ${location.marqueVoiture}`}
                className="location-image"
              />
            )}
            <p>Voiture: {location.marqueVoiture} {location.model}</p>
            <p>Date de début: {new Date(location.dateDebut).toLocaleDateString()}</p>
            <p>Date de fin: {new Date(location.dateFin).toLocaleDateString()}</p>
            <p>Prix total: {location.prixTotal} €</p>
            <p>Client: {location.nomClient}</p>
            <p style={{ color: paidLocations.includes(location.idLocation) ? 'green' : 'red' }}>
              {paidLocations.includes(location.idLocation) ? 'Payé' : 'Non payé'}
            </p>
            <button className="pay-btn me-3" onClick={() => handlePay(location)}
                hidden={paidLocations.includes(location.idLocation) ?true : false}>Payer</button>
            <button
              className="delete-btn "
              onClick={() => handleDelete(location.idLocation)}
              hidden={paidLocations.includes(location.idLocation) ?true : false}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLocations;