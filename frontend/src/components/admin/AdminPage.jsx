import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBuilding, FaUserPlus, FaUserTie, FaUserSlash } from 'react-icons/fa';
import { Card, Container, Row, Col, Dropdown } from 'react-bootstrap';
import AddAgence from '../agence/add-agence';
import ListAgences from '../agence/list-agences';
import AgenceDetails from '../agence/AgenceDetails';
import AddManager from './managers/addManager';
import Clients from './managers/clients';
import ListManagers from './managers/listManagers';
import axios from 'axios';

function AdminPage() {
  const location = useLocation();
  const { user } = location.state || {};
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [selectedAgenceId, setSelectedAgenceId] = useState(null);
  const [agences, setAgences] = useState([]);

  useEffect(() => {
    fetchAgences();
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

  const handleAddAgence = () => {
    setSelectedPage('list-agences');
  };

  const handleViewDetails = (id) => {
    setSelectedAgenceId(id);
    setSelectedPage('detail-agence');
  };

  const handleBackToList = () => {
    setSelectedPage('list-agences');
  };

  const renderContent = () => {
    switch (selectedPage) {
      case 'dashboard':
        return (
          <Container className="p-4" style={{ marginTop: '-50px' }}>
            <h2>Dashboard</h2>
            <p>Welcome to the {user.role === 'Admin' ? 'admin' : user.role === 'Employee' ? 'employee' : 'manager'} dashboard. Use the sidebar to navigate.</p>
            <Row>
              <Col md={4}>
                <Card className="mb-4" onClick={() => setSelectedPage('add-manager')}>
                  <Card.Body className="text-center">
                    <FaUserPlus size={50} className="mb-3" />
                    <Card.Title>Register Manager</Card.Title>
                    <Card.Text>
                      Add a new manager to the system.
                    </Card.Text>
                    <Link to="/register-manager" className="btn btn-primary">Go</Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} onClick={() => setSelectedPage('list-managers')}>
                <Card className="mb-4">
                  <Card.Body className="text-center">
                    <FaUserTie size={50} className="mb-3" />
                    <Card.Title>Get Managers</Card.Title>
                    <Card.Text>
                      View all managers in the system.
                    </Card.Text>
                    <Link to="/get-managers" className="btn btn-primary">Go</Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} onClick={() => setSelectedPage('clients')}>
                <Card className="mb-4">
                  <Card.Body className="text-center">
                    <FaUsers size={50} className="mb-3" />
                    <Card.Title>Get Clients</Card.Title>
                    <Card.Text>
                      View all clients in the system.
                    </Card.Text>
                    <Link to="/get-clients" className="btn btn-primary">Go</Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4" onClick={() => setSelectedPage('add-agence')}>
                  <Card.Body className="text-center">
                    <FaBuilding size={50} className="mb-3" />
                    <Card.Title>Add Agence</Card.Title>
                    <Card.Text>
                      Add a new agence to the system.
                    </Card.Text>
                    <Link to="/add-agence" className="btn btn-primary">Go</Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4" onClick={() => setSelectedPage('list-agences')}>
                  <Card.Body className="text-center">
                    <FaBuilding size={50} className="mb-3" />
                    <Card.Title>Agence List</Card.Title>
                    <Card.Text>
                      View all agence to the system.
                    </Card.Text>
                    <Link to="/list-agences" className="btn btn-primary">Go</Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        );
      case 'add-agence':
        return <AddAgence onAddAgence={handleAddAgence} />;
      case 'list-agences':
        return <ListAgences onAddAgence={() => setSelectedPage('add-agence')} onViewDetails={handleViewDetails} />;
      case 'detail-agence':
        return <AgenceDetails id={selectedAgenceId} onBack={handleBackToList} />;
      case 'add-manager':
        return <AddManager onAddManager={() => setSelectedPage('list-managers')} agences={agences} />;
      case 'list-managers':
        return <ListManagers />;
      case 'clients':
        return <Clients />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh', marginTop: '-50px' }}>
        {user.role === "Admin" && (
          <h4 className="text-center mb-4">Admin Panel</h4>
        )}
        {user.role === "Manager" && (
          <h4 className="text-center mb-4">Manager Panel</h4>
        )}
        {user.role === "Employee" && (
          <h4 className="text-center mb-4">Employee Panel</h4>
        )}
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button onClick={() => setSelectedPage('dashboard')} className="btn btn-outline-light w-100 d-flex align-items-center">
              <FaTachometerAlt className="me-2" /> Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" className="w-100 d-flex align-items-center">
                <FaUsers className="me-2" /> Users
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedPage('add-manager')}>
                  <FaUserPlus className="me-2" /> Register Manager
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedPage('list-managers')}>
                  <FaUserTie className="me-2" /> Managers List
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedPage('clients')}>
                  <FaUsers className="me-2" /> Clients List
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item mb-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" className="w-100 d-flex align-items-center">
                <FaBuilding className="me-2" /> Agence
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedPage('add-agence')}>
                  <FaBuilding className="me-2" /> Add Agence
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedPage('list-agences')}>
                  <FaBuilding className="me-2" /> List Agences
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;