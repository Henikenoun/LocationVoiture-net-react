import React, { useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const { id } = useParams(); // Récupère l'ID de la location
  const { state } = useLocation();
  const { location } = state;
  const [montant, setMontant] = useState(location.prixTotal);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5074/api/Paiement/payer",
        {
          locationId: id,
          montant: parseFloat(montant),
          datePaiement: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Paiement effectué avec succès !");
      navigate("/client-locations");
    } catch (err) {
      setError("Le paiement a échoué. Vérifiez le montant.");
    }
  };

  return (
    <div className="payment-container">
      <h1>Payer la Location</h1>
      {error && <div className="error">{error}</div>}
      <label>Montant à payer</label>
      <input
        type="number"
        value={montant}
        onChange={(e) => setMontant(e.target.value)}
        required
      />
      <button className="btn" onClick={handlePayment}>Confirmer le Paiement</button>
    </div>
  );
};

export default Payment;