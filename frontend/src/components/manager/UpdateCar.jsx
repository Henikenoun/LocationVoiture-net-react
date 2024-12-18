import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const UpdateCar = ({ carId, setSelectedPage }) => {
  const [car, setCar] = useState({
    matricule: '',
    marque: '',
    modele: '',
    dateFab: '',
    nature: '',
    prixJourn: '',
    imageUrl: '',
  });
  const [files, setFiles] = useState([]);

  // Fetch car details
  const fetchCar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5074/api/Voiture/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update the car state with fetched data
      setCar(res.data);

      // Set file preview if imageUrl exists
      if (res.data.imageUrl) {
        setFiles([{ source: res.data.imageUrl, options: { type: 'local' } }]);
      }

      console.log(res.data); // Debug log for fetched car data
    } catch (error) {
      console.error("Error fetching car:", error);
    }
  };

  // Fetch car on component mount or when carId changes
  useEffect(() => {
    console.log(carId)
    if (carId) {
      fetchCar(carId);
    }
  }, [carId]);

  // Handle car update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5074/api/Voiture/${carId}`, car, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSelectedPage('cars'); // Redirect to car list after successful update
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  // FilePond server configuration for file upload
  const serverOptions = (fieldName) => {
    return {
      load: (source, load, error, progress, abort, headers) => {
        fetch(source)
          .then((response) => response.blob())
          .then((blob) => load(blob))
          .catch((err) => {
            console.error('Error loading file:', err);
            error('Error loading file');
          });
      },
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'frontend');
        data.append('cloud_name', 'dea3u12iy');
        data.append('publicid', file.name);

        axios.post('https://api.cloudinary.com/v1_1/dea3u12iy/image/upload', data)
          .then((response) => response.data)
          .then((data) => {
            setCar((prevCar) => ({ ...prevCar, [fieldName]: data.url }));
            load(data);
          })
          .catch((err) => {
            console.error('Error uploading file:', err);
            error('Upload failed');
            abort();
          });
      },
    };
  };

  return (
    <Container>
      <div className='col-md-10 offset-md-3 border rounded p-4 mt-2 shadow' style={{marginLeft: '100px'}}>
        <Form onSubmit={handleUpdate}>
          {/* Image Upload */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                <FilePond
                  files={files}
                  acceptedFileTypes="image/*"
                  onupdatefiles={setFiles}
                  allowMultiple={false}
                  server={serverOptions('imageUrl')}
                  name="imageUrl"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Car Information */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>License Plate</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the license plate"
                  value={car.matricule}
                  onChange={(e) => setCar({ ...car, matricule: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the brand"
                  value={car.marque}
                  onChange={(e) => setCar({ ...car, marque: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the model"
                  value={car.modele}
                  onChange={(e) => setCar({ ...car, modele: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Manufacture</Form.Label>
                <Form.Control
                  type="date"
                  value={car.dateFab ?car.dateFab.split('T')[0] : ''}
                  onChange={(e) => setCar({ ...car, dateFab: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <Form.Control
                  as="select"
                  value={car.nature}
                  onChange={(e) => setCar({ ...car, nature: e.target.value })}
                >
                  <option value="">Select availability</option>
                  <option value="1">Available</option>
                  <option value="0">Not Available</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Daily Price (€)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter the daily price"
                  value={car.prixJourn}
                  onChange={(e) => setCar({ ...car, prixJourn: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Form Actions */}
          <div className="d-flex justify-content-end">
            <Button variant="success" className="btn-sm me-2" type="submit">
              <i className="fa-regular fa-floppy-disk"></i> Save
            </Button>
            <Button variant="danger" className="btn-sm" onClick={() => setSelectedPage('cars')}>
              <i className="fa-regular fa-circle-xmark"></i> Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default UpdateCar;