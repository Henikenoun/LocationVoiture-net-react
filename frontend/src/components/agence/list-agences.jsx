import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Table, Spinner, Alert, InputGroup, FormControl } from 'react-bootstrap';

const ListAgences = ({ onAddAgence, onViewDetails }) => {
  const [agences, setAgences] = useState([]);
  const [filteredAgences, setFilteredAgences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAgences();
  }, []);

  const fetchAgences = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5074/api/Agence', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgences(response.data);
      setFilteredAgences(response.data);
    } catch (error) {
      console.error('Error fetching agences:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agence?')) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.delete(`http://localhost:5074/api/Agence/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgences(agences.filter((agence) => agence.id !== id));
      setFilteredAgences(filteredAgences.filter((agence) => agence.id !== id));
    } catch (error) {
      console.error('Error deleting agence:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAgences(
      agences.filter(
        (agence) =>
          agence.nom.toLowerCase().includes(query) ||
          agence.adresse.toLowerCase().includes(query) ||
          agence.tel.toLowerCase().includes(query)
      )
    );
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Failed to fetch data. <Button onClick={fetchAgences} variant="outline-danger">Retry</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Agences List</h1>
        <Button variant="success" onClick={onAddAgence}>
          <i className="fa-solid fa-plus"></i> Create Agence
        </Button>
      </div>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Name, Address, or Phone..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-primary">
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Tel</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgences.map((agence) => (
            <tr key={agence.id}>
              <td>{agence.nom}</td>
              <td>{agence.adresse}</td>
              <td>{agence.tel}</td>
              <td className='text-center'>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => onViewDetails(agence.id)}
                >
                  <i className="fa-solid fa-info-circle"></i> Details
                </Button>
                <Button style={{marginLeft:"50px"}}
                  variant="danger"
                  onClick={() => handleDelete(agence.id)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <Spinner animation="border" size="sm" role="status" />
                  ) : (
                    <>
                      <i className="fa-solid fa-trash"></i> Delete
                    </>
                  )}
                </Button>
              </td>
            </tr>
          ))}
          {filteredAgences.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No agences found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListAgences;
