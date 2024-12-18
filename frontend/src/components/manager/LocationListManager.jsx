import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Button, Table, Container, Card, Form } from 'react-bootstrap';

const LocationListManager = () => {
  const [locations, setLocations] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLocations();
    fetchAgencies();
  }, []);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5074/api/Location', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setLocations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const managerAgenceId=JSON.parse(localStorage.getItem('user')).agenceId;
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5074/api/Agence', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("aa",response.data);
      const agg = response.data.filter(agency => agency.id === managerAgenceId);
      console.log("bb",agg);
      setAgencies(agg);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const getCarImageUrl = (voitureId) => {
    if (!agencies || agencies.length === 0) return null;
    for (const agency of agencies) {
      if (agency.voitures) {
        const car = agency.voitures.find(car => car.id === voitureId);
        if (car) {
          return car.imageUrl;
        }
      }
    }
    return null;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLocations = locations.filter(location =>
    location.marqueVoiture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.nomClient.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h3>Location List</h3>
        <Form.Group controlId="formSearch" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>
        <div className="content mt-4">
          <Table className='table table-striped'>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price (€)</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => (
                <tr key={location.idLocation}>
                  <td>
                    {getCarImageUrl(location.voitureId) && (
                      <img
                        src={getCarImageUrl(location.voitureId)}
                        alt={`Car ${location.marqueVoiture}`}
                        width="100"
                      />
                    )}
                  </td>
                  <td>{location.marqueVoiture}</td>
                  <td>{location.model}</td>
                  <td>{new Date(location.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(location.dateFin).toLocaleDateString()}</td>
                  <td>{location.prixTotal}</td>
                  <td>{location.nomClient}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LocationListManager;