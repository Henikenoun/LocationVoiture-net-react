import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { Container, Row, Col, Card, Button, Spinner, Dropdown } from 'react-bootstrap';
import { FaTachometerAlt, FaUsers, FaBuilding, FaCar, FaUserPlus, FaList, FaPlus, FaMapMarkerAlt, FaTools } from 'react-icons/fa';
import AddVoiture from '../manager/AddVoiture';
import Table_Car from '../manager/Table_Car';
import AddEmployee from '../manager/AddEmployee';
import UpdateAgence from '../manager/UpdateAgence';
import CarDetails from '../manager/CarDetails';
import UpdateCar from '../manager/UpdateCar';
import Table_Employee from '../manager/Table_Employee';
import LocationListManager from '../manager/LocationListManager';
import MaintenanceListManager from '../manager/MaintenanceListManager';

const ManagerPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [agence, setAgence] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [selectedCarId, setSelectedCarId] = useState(null);

  useEffect(() => {
    const fetchAgenceDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://localhost:5074/api/Agence', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const userAgence = response.data.find((agence) => agence.id === user.agenceId);

        if (userAgence) {
          setAgence(userAgence);
          setEmployees(userAgence.employees || []);
          setVoitures(userAgence.voitures || []);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching agence details:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchAgenceDetails();
  }, []);

  const renderDashboard = () => (
    <Container className="p-4" style={{ width: '80%' }}>
      <h2>Dashboard</h2>
      <Row>
        {[
          { title: 'Agence Details', icon: <FaBuilding size={50} />, page: 'details' },
          ...(user?.role === 'Manager' ? [{ title: 'Add Employee', icon: <FaUserPlus size={50} />, page: 'add-employee' }] : []),
          { title: 'List Employees', icon: <FaList size={50} />, page: 'employees' },
          { title: 'Add Car', icon: <FaPlus size={50} />, page: 'add-car' },
          { title: 'List Cars', icon: <FaCar size={50} />, page: 'cars' },
          { title: 'List Locations', icon: <FaMapMarkerAlt size={50} />, page: 'locations' },
          { title: 'List Maintenances', icon: <FaTools size={50} />, page: 'maintenances' },
        ].map((item, idx) => (
          <Col md={4} key={idx}>
            <Card className="mb-4" onClick={() => setSelectedPage(item.page)}>
              <Card.Body className="text-center">
                {item.icon}
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>View and manage {item.title.toLowerCase()}.</Card.Text>
                <Button variant="primary">Go</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );

  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return renderDashboard();
      case 'details':
        return agence ? <UpdateAgence agence={agence} /> : <p>No agence data available.</p>;
      case 'add-employee':
        return <AddEmployee agenceId={agence.id} setSelectedPage={setSelectedPage} />;
      case 'employees':
        return <Table_Employee employees={employees} />;
      case 'add-car':
        return <AddVoiture setSelectedPage={setSelectedPage} />;
      case 'cars':
        return <Table_Car setSelectedPage={setSelectedPage} setSelectedCarId={setSelectedCarId} />;
      case 'car-details':
        return <CarDetails id={selectedCarId} setSelectedCarId={setSelectedCarId} setSelectedPage={setSelectedPage} />;
      case 'edit-car':
        return <UpdateCar carId={selectedCarId} setSelectedPage={setSelectedPage} />;
      case 'locations':
        return <LocationListManager />;
      case 'maintenances':
        return <MaintenanceListManager />;
      default:
        return <p>Invalid page selected.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ marginTop: '-50px' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <h4 className="text-center mb-4">{user?.role === 'Manager' ? 'Manager Panel' : 'Employee Panel'}</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button onClick={() => setSelectedPage('dashboard')} className="btn btn-outline-light w-100 d-flex align-items-center">
              <FaTachometerAlt className="me-2" /> Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" className="w-100 d-flex align-items-center">
                <FaUsers className="me-2" /> Employees
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user?.role === 'Manager' &&(
                <Dropdown.Item onClick={() => setSelectedPage('add-employee')}>
                  <FaUserPlus className="me-2" /> Add Employee
                </Dropdown.Item>)}
                <Dropdown.Item onClick={() => setSelectedPage('employees')}>
                  <FaList className="me-2" /> List Employees
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item mb-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" className="w-100 d-flex align-items-center">
                <FaCar className="me-2" /> Cars
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedPage('add-car')}>
                  <FaPlus className="me-2" /> Add Car
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedPage('cars')}>
                  <FaList className="me-2" /> List Cars
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item mb-2">
            <button onClick={() => setSelectedPage('details')} className="btn btn-outline-light w-100 d-flex align-items-center">
              <FaBuilding className="me-2" /> Agence Details
            </button>
          </li>
          <li className="nav-item mb-2">
            <button onClick={() => setSelectedPage('locations')} className="btn btn-outline-light w-100 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" /> Locations
            </button>
          </li>
          <li className="nav-item mb-2">
            <button onClick={() => setSelectedPage('maintenances')} className="btn btn-outline-light w-100 d-flex align-items-center">
              <FaTools className="me-2" /> Maintenances
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default ManagerPage;