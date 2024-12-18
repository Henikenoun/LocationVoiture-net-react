import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Button } from 'react-bootstrap';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5074/api/Account/GetAllClients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
      setFilteredClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredClients(
      clients.filter(
        (client) =>
          client.nom.toLowerCase().includes(query) ||
          client.prenom.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query)
      )
    );
  };

  if (isLoading) {
    return <center><ReactLoading type='bars' color="red" height={'4%'} width={'4%'} /></center>;
  }

  if (isError) {
    return <div className="text-danger text-center">Network Error</div>;
  }

  return (
    <div className="container w-100 px-5">
      <div className="text-center mb-4">
        <h1 className="text-primary" style={{ borderBottom: '2px solid #007BFF', display: 'inline-block' }}>
          Clients List
        </h1>
      </div>
      <div className="search-bar mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="content">
        <table className='table table-striped '>
          <thead className="table-primary">
            <tr style={{ height: '60px' }}>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Date de Naissance</th>
              <th>Phone Number</th>
              <th>Nombre de Voitures</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={index} style={{ height: '60px' }}>
                <td>{client.nom}</td>
                <td>{client.prenom}</td>
                <td>{client.email}</td>
                <td>{client.adresse}</td>
                <td>{client.dateNaiss}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.nbVoiture}</td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
