import axios from 'axios';
import React, { useState, useEffect,useContext } from 'react';
import ReactLoading from 'react-loading';
import { Card, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';

const Table_Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useContext(AuthContext);
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5074/api/Account/GetAllEmployees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5074/api/Account/DeleteUser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.agenceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <center><ReactLoading type='bars' color="red" height={'4%'} width={'4%'} /></center>;
  }

  if (isError) {
    return <div>Network Error</div>;
  }

  return (
    <Card className="m-4 p-5" style={{ marginLeft: "135px !important" }}>
      <Card.Body>
        <h3>Employee List</h3>
        <Form.Group controlId="formSearch" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>
        <div className="content mt-4">
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Address</th>
                <th>Position</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Agency</th>
                {user?.role === 'Manager' &&(<th>Operations</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.nom}</td>
                  <td>{employee.prenom}</td>
                  <td>{employee.adresse}</td>
                  <td>{employee.poste}</td>
                  <td>{new Date(employee.dateNaiss).toLocaleDateString()}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.agenceName}</td>
                  <td>
                  {user?.role === 'Manager' &&(<Button variant="danger" size="sm" onClick={() => handleDelete(employee.id)}>
                      <i className="fa-solid fa-trash"></i> Delete
                    </Button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Table_Employee;