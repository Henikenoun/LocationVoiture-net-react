import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Container } from 'react-bootstrap';

const CarDetails = ({ id, setSelectedCarId, setSelectedPage }) => {
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5074/api/Voiture/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading car details</div>;
  }

  return (
    <Container>
      <Card className="mt-4">
        <Card.Header>
          <h2>Car Details</h2>
        </Card.Header>
        <Card.Body>
          <Card.Img
            variant="top"
            height="500px"
            src={car.imageUrl}
            alt={`${car.marque} ${car.modele}`}
          />
          <Card.Text>
            <strong>Matricule:</strong> {car.matricule}
          </Card.Text>
          <Card.Text>
            <strong>Marque:</strong> {car.marque}
          </Card.Text>
          <Card.Text>
            <strong>Modèle:</strong> {car.modele}
          </Card.Text>
          <Card.Text>
            <strong>Date de Fabrication:</strong>{' '}
            {new Date(car.dateFab).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            <strong>Nature:</strong> {car.nature}
          </Card.Text>
          <Card.Text>
            <strong>Prix Journalier (€):</strong> {car.prixJourn}
          </Card.Text>
          <Button
            variant="primary"
            className="btn me-2"
            onClick={() => {
              setSelectedCarId(id);
              setSelectedPage('edit-car');
            }}
          >
            Edit
          </Button>
          <Button variant="secondary" onClick={() => setSelectedPage('cars')}>
            Back to List
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CarDetails;