import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddEmployee = ({ agenceId, setSelectedPage }) => {
  const [employee, setEmployee] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    poste: '',
    dateNaiss: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5074/api/Account/RegisterEmployee', { ...employee, agenceId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error registering employee:', error);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPage('employees');
    navigate('/manager');
  };

  return (
    <Card className="m-4 p-5" style={{ marginLeft: "135px !important" }}>
      <Card.Body>
        <h3>Add Employee</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNom" className="mt-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={employee.nom}
              onChange={handleChange}
              required
            />
            {errors.nom && <div className="text-danger">{errors.nom.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formPrenom" className="mt-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="prenom"
              value={employee.prenom}
              onChange={handleChange}
              required
            />
            {errors.prenom && <div className="text-danger">{errors.prenom.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formAdresse" className="mt-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="adresse"
              value={employee.adresse}
              onChange={handleChange}
              required
            />
            {errors.adresse && <div className="text-danger">{errors.adresse.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formPoste" className="mt-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              as="select"
              name="poste"
              value={employee.poste}
              onChange={handleChange}
              required
            >
              <option value="">Select a position</option>
              <option value="Aide Manager">Assistant Manager</option>
              <option value="Employé normal">Regular Employee</option>
            </Form.Control>
            {errors.poste && <div className="text-danger">{errors.poste.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formDateNaiss" className="mt-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateNaiss"
              value={employee.dateNaiss}
              onChange={handleChange}
              required
            />
            {errors.dateNaiss && <div className="text-danger">{errors.dateNaiss.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="text-danger">{errors.email.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="text-danger">{errors.password.join(', ')}</div>}
          </Form.Group>
          <Form.Group controlId="formPhoneNumber" className="mt-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="phoneNumber"
              value={employee.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber.join(', ')}</div>}
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Add Employee
          </Button>
        </Form>
      </Card.Body>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Employee Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The employee has been added successfully!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default AddEmployee;