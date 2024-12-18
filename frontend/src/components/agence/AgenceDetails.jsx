import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Button } from 'react-bootstrap';

const AgenceDetails = ({ id, onBack }) => {
  const [agence, setAgence] = useState({});
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [filteredVoitures, setFilteredVoitures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchVoiture, setSearchVoiture] = useState('');

  useEffect(() => {
    fetchAgenceDetails();
  }, [id]);

  const fetchAgenceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`http://localhost:5074/api/Agence/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const agenceData = response.data;

      setAgence(agenceData);
      setEmployees(agenceData.employees || []);
      setFilteredEmployees(agenceData.employees || []);
      setVoitures(agenceData.voitures || []);
      setFilteredVoitures(agenceData.voitures || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching agence details:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleEmployeeSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmployee(query);
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.nom.toLowerCase().includes(query) ||
          emp.prenom.toLowerCase().includes(query) ||
          emp.poste.toLowerCase().includes(query)
      )
    );
  };

  const handleVoitureSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchVoiture(query);
    setFilteredVoitures(
      voitures.filter(
        (car) =>
          car.marque.toLowerCase().includes(query) ||
          car.modele.toLowerCase().includes(query) ||
          car.matricule.toLowerCase().includes(query)
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="px-3 text-primary">Agency Details</h1>
        <Button variant="secondary" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back to List
        </Button>
      </div>

      {/* Agency Information */}
      <div className="content mb-5">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{agence.nom || 'N/A'}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{agence.adresse || 'N/A'}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{agence.tel || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Employee List */}
      <div className="content mb-5">
        <h3 className="mb-3">Employees</h3>
        <input
          type="text"
          placeholder="Search employees..."
          className="form-control mb-3"
          value={searchEmployee}
          onChange={handleEmployeeSearch}
        />
        <table className="table table-striped">
          <thead>
            <tr style={{ height: '60px' }}>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp, index) => (
                <tr key={index} style={{ height: '60px' }}>
                  <td>{emp.nom || 'N/A'}</td>
                  <td>{emp.prenom || 'N/A'}</td>
                  <td>{emp.poste || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Car List */}
      <div className="content">
        <h3 className="mb-3">Cars</h3>
        <input
          type="text"
          placeholder="Search cars..."
          className="form-control mb-3"
          value={searchVoiture}
          onChange={handleVoitureSearch}
        />
        <table className="table table-striped">
          <thead>
            <tr style={{ height: '60px' }}>
              <th>Car</th>
              <th>Brand</th>
              <th>Model</th>
              <th>License Plate</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {filteredVoitures.length > 0 ? (
              filteredVoitures.map((car, index) => (
                <tr key={index} style={{ height: '60px' }}>
                  <td><img src={car.imageUrl || 'N/A'} alt="Car" width="80px"/></td>
                  <td>{car.marque || 'N/A'}</td>
                  <td>{car.modele || 'N/A'}</td>
                  <td>{car.matricule || 'N/A'}</td>
                  <td>{car.nature === '1' ? <span className="text-success">available</span> : <span className="text-danger">unavailable</span>}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No cars found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgenceDetails;
