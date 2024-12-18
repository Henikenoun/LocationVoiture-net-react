import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddLocation.css"; // CSS pour styliser la page

const AddLocation = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Récupère les détails de la voiture depuis la navigation
  const { voiture } = state; // Voiture passée en tant que state lors de la navigation
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
  });
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [nextAvailableDate, setNextAvailableDate] = useState("");

  useEffect(() => {
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);

      if (dateDebut > dateFin) {
        setError("La date de début doit être antérieure à la date de fin.");
        setTotalCost(0);
        setIsAvailable(false);
        toast.error("La date de début doit être antérieure à la date de fin.");
        return;
      }

      const diffTime = Math.abs(dateFin - dateDebut);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const cost = diffDays * voiture.prixJourn;
      setTotalCost(cost);

      // Vérifier la disponibilité des dates
      let available = true;
      let nextAvailable = "";

      for (const loc of availability) {
        const locDebut = new Date(loc.dateDebut);
        const locFin = new Date(loc.dateFin);

        if (
          (dateDebut >= locDebut && dateDebut <= locFin) || // Début dans une plage
          (dateFin >= locDebut && dateFin <= locFin) || // Fin dans une plage
          (dateDebut <= locDebut && dateFin >= locFin) // Entoure une plage
        ) {
          available = false;
          if (!nextAvailable || locFin > new Date(nextAvailable)) {
            nextAvailable = new Date(locFin.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
          }
        }
      }

      setIsAvailable(available);
      setNextAvailableDate(
        !available && nextAvailable ? nextAvailable.toISOString().split("T")[0] : ""
      );

      if (!available) {
        setError("Les dates choisies ne sont pas disponibles.");
        toast.error("Les dates choisies ne sont pas disponibles.");
      } else {
        setError("");
      }
    }
  }, [formData.dateDebut, formData.dateFin, voiture.prixJourn, availability]);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5074/api/Location", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allLocations = response.data.filter(
          (location) => location.voitureId === voiture.id
        );
        setAvailability(allLocations);
      } catch (err) {
        console.error("Erreur lors de la récupération des locations.", err);
        toast.error("Erreur lors de la récupération des locations.");
      }
    };

    fetchLocations();
  }, [voiture.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!isAvailable) {
      toast.error("Les dates sélectionnées ne sont pas disponibles.");
      return;
    }

    if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      setError("La date de début doit être antérieure à la date de fin.");
      toast.error("La date de début doit être antérieure à la date de fin.");
      return;
    }

    const locationData = {
      voitureId: voiture.id,
      marqueVoiture: voiture.marque,
      model: voiture.modele,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      prixTotal: totalCost,
    };

    try {
      const response = await axios.post(
        "http://localhost:5074/api/Location",
        locationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Location ajoutée avec succès !");
      navigate("/client-locations"); // Redirection vers la liste des locations
    } catch (err) {
      setError("Échec de l'ajout de la location. Veuillez réessayer.");
      toast.error("Échec de l'ajout de la location. Veuillez réessayer.");
    }
  };

  return (
    <div className="add-location-container w-100">
      <ToastContainer />
      <h1>Ajouter une Location</h1>
      {error && <div className="error">{error}</div>}
      <div className="car-details">
        <h2>Marque : {voiture.marque} </h2>
        <h2>Model : {voiture.modele} </h2>
        <img
          src={voiture.imageUrl || "/default-car.jpg"} // Image par défaut si aucune URL n'est fournie
          alt="Voiture"
          className="car-image"
        />
      </div>
      <form className="add-location-form" onSubmit={handleSubmit}>
        <label>Date de début</label>
        <input
          type="date"
          name="dateDebut"
          value={formData.dateDebut}
          onChange={handleChange}
          required
        />
        <label>Date de fin</label>
        <input
          type="date"
          name="dateFin"
          value={formData.dateFin}
          onChange={handleChange}
          required
        />
        {nextAvailableDate && (
          <p className="info">
            Prochaine disponibilité : <strong>{nextAvailableDate}</strong>
          </p>
        )}
        <p>Prix total: {totalCost} €</p>
        <button
          type="submit"
          className={`btn ${!isAvailable ? "btn-disabled" : ""}`}
          disabled={!isAvailable}
        >
          Ajouter la Location
        </button>
      </form>
    </div>
  );
};

export default AddLocation;