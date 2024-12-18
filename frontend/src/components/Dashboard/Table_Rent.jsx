import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

const Table_Rent = () => {
  const [rents, setRents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/rents')
      .then(response => response.json())
      .then(data => {
        setRents(data.data); // Access the 'data' property of the response
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rents:', error);
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <center><ReactLoading type='bars' color="red" height={'4%'} width={'4%'} /></center>;
  }

  if (isError) {
    return <div>Erreur de réseaux</div>;
  }

  return (
    <div>
      <div className="main-content">
        <div className="search-bar">
          <input type="text" placeholder="Search ..." />
        </div>
        <div className="content">
          <h1>Rents</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Car ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {rents.map((rent) => (
                <tr key={rent.id}>
                  <td>{rent.id}</td>
                  <td>{rent.user_id}</td>
                  <td>{rent.car_id}</td>
                  <td>{rent.start_date}</td>
                  <td>{rent.end_date}</td>
                  <td>{rent.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table_Rent;