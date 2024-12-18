import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

const Table_User = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users');
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/delete-user/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (isLoading) {
    return <center><ReactLoading type='bars' color="red" height={'4%'} width={'4%'} /></center>;
  }

  if (isError) {
    return <div>Network Error</div>;
  }

  return (
    <div>
      <div className="main-content">
        <div className="search-bar">
          <input type="text" placeholder="Search ..." />
        </div>
        <div className="content">
          <h1>Hi, Admin</h1>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Telephone</th>
                <th>Email</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.telephone}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className='btn btn-danger btn-sm' onClick={() => handleDelete(user.id)}>
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table_User;