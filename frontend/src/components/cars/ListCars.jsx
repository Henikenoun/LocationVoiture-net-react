import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./list.css";

const ListCars = () => {
  const { agencyId } = useParams();
  const [cars, setCars] = useState([]);
  const [carAvailability, setCarAvailability] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5074/api/Agence/${agencyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCars(response.data.voitures || []);
        console.log(response.data.voitures)
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures:", error);
        setError("Impossible de récupérer les voitures. Veuillez réessayer plus tard.");
      }
    };

    const fetchCarAvailability = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5074/api/Location",{
            headers: { Authorization: `Bearer ${token}` },
          });
        const locations = response.data;
        const availability = {};
        locations.forEach((loc) => {
          if (!availability[loc.voitureId]) availability[loc.voitureId] = [];
          availability[loc.voitureId].push(loc.dateFin);
        });
        setCarAvailability(availability);
      } catch (error) {
        console.error("Erreur lors de la récupération des locations:", error);
      }
    };

    fetchCars();
    fetchCarAvailability();
    console.log("cars",cars)
  }, [agencyId]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <main className="cars-container">
      {cars.length > 0 ? (
        cars.map((car) => {
          const nextAvailableDate =
            carAvailability[car.id] &&
            new Date(
              Math.max(...carAvailability[car.id].map((date) => new Date(date)))
            ) ;
          return (
            <div key={car.id} className="car-card">
              <div className="card-body">
                <img
                  src={car.imageUrl || "/default-car.jpg"}
                  alt={`${car.marque} ${car.modele}`}
                  className="car-image"
                />
                <h1 className="card-title">
                  {car.modele} {car.marque}
                </h1>
                <p className="card-details">Prix par jour : {car.prixJourn} €</p>
                <p
                  className={`card-availability ${
                    nextAvailableDate ? "not-available" : "available"
                  }`}
                >
                  {nextAvailableDate
                    ? `Disponible à partir du ${nextAvailableDate.toLocaleDateString()}`
                    : "Disponible maintenant"}
                </p>
                <Link
                  to={`/add-location`}
                  state={{ voiture: car }}
                  className="btn"
                >
                  Louer
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <div>Pas de voitures disponibles dans cette agence.</div>
      )}
    </main>
  );
};

export default ListCars;
