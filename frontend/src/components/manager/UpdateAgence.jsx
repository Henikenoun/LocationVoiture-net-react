import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'; // Adjust the path as necessary

const UpdateAgence = ({ agence }) => {
  const [updatedAgence, setUpdatedAgence] = useState({ nom: agence.nom, adresse: agence.adresse, tel: agence.tel });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    setUpdatedAgence({ nom: agence.nom, adresse: agence.adresse, tel: agence.tel });
  }, [agence]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAgence((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5074/api/Agence/${agence.id}`,
        {
          nom: updatedAgence.nom,
          adresse: updatedAgence.adresse,
          tel: updatedAgence.tel
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsEditing(false);
      navigate(0); // Reload page
    } catch (error) {
      console.error('Error updating agence:', error);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const renderField = (label, name, type = 'text') => (
    <Form.Group controlId={`form${name}`} className="mt-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={updatedAgence[name] || ''}
        onChange={handleChange}
        required
      />
      {errors[name] && (
        <div className="text-danger">
          {errors[name].join(', ')}
        </div>
      )}
    </Form.Group>
  );

  return (
    <Card className="m-4 p-5" style={{marginLeft: '135px !important'}} >
      <Card.Body>
        <h2 className="mb-4">Agency Profile</h2>
        {!isEditing ? (
          <>
            <Row>
              <Col><strong>Name:</strong> {agence.nom}</Col>
              <Col><strong>Address:</strong> {agence.adresse}</Col>
              <Col><strong>Phone:</strong> {agence.tel}</Col>
            </Row>
            {user?.role == "Manager" &&(<Button variant="primary" className="mt-4" onClick={() => setIsEditing(true)}>
              Update
            </Button>)}
          </>
        ) : (
          <Card className="mt-4 p-5" style={{ width: '100%' }}>
            <Card.Body>
              <h3>Update Agency</h3>
              <Form onSubmit={handleSubmit}>
                {renderField('Name', 'nom')}
                {renderField('Address', 'adresse')}
                {renderField('Phone', 'tel')}
                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default UpdateAgence;