import axios from 'axios';
import React, { useState, useEffect ,useContext} from 'react';
import ReactLoading from 'react-loading';
import { Button, Table, Container, Card, Form, Modal } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';

const MaintenanceListManager = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchMaintenances();
    fetchCars();
    fetchLocations();
  }, []);

  const fetchMaintenances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5074/api/Maintenance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMaintenances(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5074/api/Voiture', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5074/api/Location', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleAddMaintenance = (car) => {
    setSelectedCar(car);
    setShowAddModal(true);
  };

  const handleSaveMaintenance = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const maintenanceData = {
      voitureId: selectedCar.id,
      description: e.target.description.value,
      dateEntree: e.target.dateEntree.value,
      dateSortie: e.target.dateSortie.value,
      cout: e.target.cout.value,
    };
    try {
      await axios.post('http://localhost:5074/api/Maintenance', maintenanceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await axios.put(`http://localhost:5074/api/Voiture/${selectedCar.id}`, {
        ...selectedCar,
        nature: '0'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowAddModal(false);
      fetchMaintenances();
      fetchCars();
    } catch (error) {
      console.error('Error adding maintenance:', error);
    }
  };

  const handleUpdateMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowUpdateModal(true);
  };

  const handleSaveUpdatedMaintenance = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const maintenanceData = {
      voitureId: selectedMaintenance.voitureId,
      description: e.target.description.value,
      dateEntree: e.target.dateEntree.value,
      dateSortie: e.target.dateSortie.value,
      cout: e.target.cout.value,
    };
    try {
      await axios.put(`http://localhost:5074/api/Maintenance/${selectedMaintenance.idMaintenance}`, maintenanceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowUpdateModal(false);
      fetchMaintenances();
    } catch (error) {
      console.error('Error updating maintenance:', error);
    }
  };

  const handleDeleteMaintenance = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5074/api/Maintenance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaintenances(maintenances.filter(maintenance => maintenance.idMaintenance !== id));
    } catch (err) {
      console.error("Error deleting maintenance:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getCarLocationCount = (carId) => {
    return locations.filter(location => location.voitureId === carId).length;
  };

  const getLocationCountColor = (count) => {
    if (count > 5) return 'red';
    if (count >= 3) return 'orange';
    return 'green';
  };

  const filteredMaintenances = maintenances.filter(maintenance =>
    maintenance.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCars = cars.filter(car =>
    car.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.modele.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <center><ReactLoading type='bars' color="red" height={'4%'} width={'4%'} /></center>;
  }

  if (isError) {
    return <div>Network Error</div>;
  }

  return (
    <Container>
      <Card className="m-4 p-5" style={{ marginLeft: "135px !important" }}>
        <Card.Body>
          <h3>Maintenance List</h3>
          <Form.Group controlId="formSearch" className="mt-3">
            <Form.Control
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
          <div className="content mt-4">
            {filteredMaintenances.length > 0 && (
              <>
                <h4>Existing Maintenances</h4>
                <Table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Car</th>
                      <th>Description</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Cost (€)</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaintenances.map((maintenance) => (
                      <tr key={maintenance.idMaintenance}>
                        <td>{maintenance.marque} {maintenance.model}</td>
                        <td>{maintenance.description}</td>
                        <td>{new Date(maintenance.dateEntree).toLocaleDateString()}</td>
                        <td>{maintenance.dateSortie ? new Date(maintenance.dateSortie).toLocaleDateString() : 'N/A'}</td>
                        <td>{maintenance.cout}</td>
                        <td>
                          <Button
                            variant="primary"
                            className="btn-sm me-2"
                            onClick={() => handleUpdateMaintenance(maintenance)}
                          >
                            Update
                          </Button>
                          {user?.role === 'Manager' &&(<Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => handleDeleteMaintenance(maintenance.idMaintenance)}
                          >
                            Delete
                          </Button>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
            {filteredCars.length > 0 && (
              <>
                <h4>Cars</h4>
                <Table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Car</th>
                      <th>Brand</th>
                      <th>Model</th>
                      <th>Number of Locations</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr key={car.id}>
                        <td>
                          <img
                            src={car.imageUrl}
                            alt={`${car.marque} ${car.modele}`}
                            width="100"
                          />
                        </td>
                        <td>{car.marque} {car.modele}</td>
                        <td>{car.marque}</td>
                        <td>{car.modele}</td>
                        <td style={{ color: getLocationCountColor(getCarLocationCount(car.id)) }}>
                          {getCarLocationCount(car.id)}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            className="btn-sm"
                            onClick={() => handleAddMaintenance(car)}
                          >
                            Add Maintenance
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Add Maintenance Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveMaintenance}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter maintenance description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="dateEntree"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="dateSortie"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost (€)</Form.Label>
              <Form.Control
                type="number"
                name="cout"
                placeholder="Enter maintenance cost"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Maintenance Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveUpdatedMaintenance}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter maintenance description"
                defaultValue={selectedMaintenance?.description}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="dateEntree"
                defaultValue={selectedMaintenance?.dateEntree.split('T')[0]}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="dateSortie"
                defaultValue={selectedMaintenance?.dateSortie?.split('T')[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost (€)</Form.Label>
              <Form.Control
                type="number"
                name="cout"
                placeholder="Enter maintenance cost"
                defaultValue={selectedMaintenance?.cout}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MaintenanceListManager;