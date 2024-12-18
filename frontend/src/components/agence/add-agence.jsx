import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

const AddAgence = ({ onAddAgence }) => {
  const [agence, setAgence] = useState({ nom: '', adresse: '', tel: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgence({ ...agence, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.post('http://localhost:5074/api/Agence', agence, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage('Agence added successfully!');
      setAgence({ nom: '', adresse: '', tel: '' });
      onAddAgence(); // Callback function after successful addition
    } catch (error) {
      console.error('Error adding agence:', error);
      setErrorMessage('Failed to add Agence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="m-y">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm p-5">
            <Card.Body>
              <h2 className="text-center text-primary mb-4">Add New Agence</h2>
              
              {/* Success Alert */}
              {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                  {successMessage}
                </Alert>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNom" className="mb-4">
                  <Form.Label>Agency Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter agency name"
                    name="nom"
                    value={agence.nom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formAdresse" className="mb-4">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    name="adresse"
                    value={agence.adresse}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formTel" className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter phone number"
                    name="tel"
                    value={agence.tel}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" className="py-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Adding...
                      </>
                    ) : (
                      'Add Agence'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAgence;
