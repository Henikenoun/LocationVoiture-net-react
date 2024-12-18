import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ListCars from './ListCars';

const SearchResults = () => {
  const [cars, setCars] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const modelRes = await axios.get(`http://localhost:8000/api/cars/model/${query}`);
        const brandRes = await axios.get(`http://localhost:8000/api/cars/brand/${query}`);
        
        const combinedResults = [...modelRes.data.data, ...brandRes.data.data];
        const uniqueResults = Array.from(new Set(combinedResults.map(car => car.id)))
                                   .map(id => combinedResults.find(car => car.id === id));
        
        console.log('Fetched cars:', uniqueResults); // Debugging statement
        setCars(uniqueResults); // Assuming the response has a 'data' field with the cars
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    if (query) {
      fetchCars();
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results</h1>
      <ListCars cars={cars} />
    </div>
  );
};

export default SearchResults;