import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Button } from 'react-bootstrap';

const ListManagers = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5074/api/Account/GetAllManagers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(response.data);
      setFilteredManagers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredManagers(
      managers.filter(
        (manager) =>
          manager.nom.toLowerCase().includes(query) ||
          manager.prenom.toLowerCase().includes(query) ||
          manager.email.toLowerCase().includes(query)
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
        Managers List
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
        <table className='table table-striped'>
          <thead className="table-primary">
            <tr style={{ height: '60px' }}>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Date de Naissance</th>
              <th>Poste</th>
              <th>Phone Number</th>
              <th>Agence</th>
            </tr>
          </thead>
          <tbody>
            {filteredManagers.map((manager, index) => (
              <tr key={index} style={{ height: '60px' }}>
                <td>{manager.nom}</td>
                <td>{manager.prenom}</td>
                <td>{manager.email}</td>
                <td>{manager.adresse}</td>
                <td>{manager.dateNaiss}</td>
                <td>{manager.poste}</td>
                <td>{manager.phoneNumber}</td>
                <td>{manager.agenceName}</td>
              </tr>
            ))}
            {filteredManagers.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">No managers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListManagers;
