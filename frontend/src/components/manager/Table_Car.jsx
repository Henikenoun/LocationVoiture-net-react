import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import ReactLoading from 'react-loading';
import { Button, Table, Container, Card, Form } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';

const Table_Car = ({ setSelectedPage, setSelectedCarId }) => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5074/api/Voiture', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
      setIsLoading(false);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5074/api/Voiture/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(cars.filter(car => car.id !== id));
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCars = cars.filter(car =>
    car.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.dateFab.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.prixJourn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.nature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <center><ReactLoading type='bars' color="red" height={'4%'} width={'4%'} /></center>;
  }

  if (isError) {
    return <div>Network Error</div>;
  }

  return (
    <Card className="m-4 p-5" style={{ marginLeft: "135px !important" }}>
      <Card.Body>
        <h3>Car List</h3>
        <Form.Group controlId="formSearch" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>
        <div className="content mt-4">
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Photo</th>
                <th>License Plate</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Date of Manufacture</th>
                <th>Availability</th>
                <th>Daily Price (€)</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <img
                      src={car.imageUrl}
                      alt={`${car.marque} ${car.modele}`}
                      width="100"
                    />
                  </td>
                  <td>{car.matricule}</td>
                  <td>{car.marque}</td>
                  <td>{car.modele}</td>
                  <td>{new Date(car.dateFab).toLocaleDateString()}</td>
                  <td>
                    <span style={{ color: car.nature === '1' ? 'green' : 'red' }}>
                      {car.nature === '1' ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td>{car.prixJourn}</td>
                  <td>
                    <Button
                      variant="secondary"
                      className="btn-sm me-2"
                      onClick={() => {
                        setSelectedCarId(car.id);
                        setSelectedPage('car-details');
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      className="btn-sm me-2"
                      onClick={() => {
                        setSelectedCarId(car.id);
                        setSelectedPage('edit-car');
                      }}
                    >
                      Edit
                    </Button>
                    {user?.role === 'Manager' &&(<Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleDelete(car.id)}
                    >
                      🗑
                    </Button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Table_Car;