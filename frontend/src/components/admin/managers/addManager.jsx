import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const AddManager = ({ onAddManager }) => {
  const [manager, setManager] = useState({ email: '', password: '', nom: '', prenom: '', adresse: '', dateNaiss: '', poste: '', phoneNumber: '', agenceId: '' });
  const [agences, setAgences] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchAgences();
    fetchManagers();
  }, []);

  const fetchAgences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:5074/api/Agence', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAgences(response.data);
    } catch (error) {
      console.error('Error fetching agences:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:5074/api/Account/GetAllManagers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setManagers(response.data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManager({ ...manager, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5074/api/Account/RegisterManager', manager, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onAddManager();
    } catch (error) {
      console.error('Error adding manager:', error);
    }
  };

  const filteredAgences = agences.filter(agence => !managers.some(manager => manager.agenceId === agence.id));

  return (
    <Container className="my-3">
      <Row className="justify-content-center p-5">
        <Col md={10}>
          <Card style={{ width: "100%" }}>
            <Card.Body style={{ textAlign: "start" }}>
              <h2 className="text-center text-primary mt-3 mb-4">Add Manager</h2>
              <Form onSubmit={handleSubmit} className="p-5">
                <Form.Group controlId="formNom">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={manager.nom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPrenom" className="mt-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={manager.prenom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={manager.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={manager.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAdresse" className="mt-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={manager.adresse}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formDateNaiss" className="mt-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateNaiss"
                    value={manager.dateNaiss}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPoste" className="mt-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    as="select"
                    name="poste"
                    value={manager.poste}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Position</option>
                    <option value="global-manager">Global Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="small-manager">Small Manager</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formPhoneNumber" className="mt-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="phoneNumber"
                    value={manager.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAgenceId" className="mt-3">
                  <Form.Label>Agency</Form.Label>
                  <Form.Control
                    as="select"
                    name="agenceId"
                    value={manager.agenceId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Agency</option>
                    {filteredAgences.map((agence) => (
                      <option key={agence.id} value={agence.id}>
                        {agence.nom}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-5 w-25 float-end">
                  Add Manager
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddManager;
