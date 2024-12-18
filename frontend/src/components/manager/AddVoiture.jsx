import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AddVoiture = ({ setSelectedPage }) => {
  const [voiture, setVoiture] = useState({
    matricule: '',
    marque: '',
    modele: '',
    dateFab: '',
    availability: '',
    prixJourn: '',
    imageUrl: '',
  });
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5074/api/Voiture', voiture, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error adding the car", error);
    }
  };

  const handleReset = () => {
    setVoiture({
      matricule: '',
      marque: '',
      modele: '',
      dateFab: '',
      availability: '',
      prixJourn: '',
      imageUrl: '',
    });
    setFiles([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPage('cars');
    navigate('/manager');
  };

  const serverOptions = (fieldName) => {
    return {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'frontend');
        data.append('cloud_name', 'dea3u12iy');
        data.append('publicid', file.name);

        axios.post('https://api.cloudinary.com/v1_1/dea3u12iy/image/upload', data)
          .then((response) => response.data)
          .then((data) => {
            setVoiture((prevVoiture) => ({ ...prevVoiture, [fieldName]: data.url }));
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
    <div className="d-flex justify-content-center align-items-center vh-100 my-5 p-5">
      <Card className="p-5" style={{width:"70rem",marginTop:"150px", boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">🚗 <strong>Add Car</strong></Card.Title>
          <Form onSubmit={handleSave}>
            <Card.Subtitle className="mb-3 text-muted">Car Information</Card.Subtitle>
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
            <Form.Group className="mb-3">
              <Form.Label>License Plate</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the license plate"
                value={voiture.matricule}
                onChange={(e) => setVoiture({ ...voiture, matricule: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the brand"
                value={voiture.marque}
                onChange={(e) => setVoiture({ ...voiture, marque: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the model"
                value={voiture.modele}
                onChange={(e) => setVoiture({ ...voiture, modele: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Manufacture</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter the date of manufacture"
                value={voiture.dateFab}
                onChange={(e) => setVoiture({ ...voiture, dateFab: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Availability</Form.Label>
              <Form.Control
                as="select"
                value={voiture.nature}
                onChange={(e) => setVoiture({ ...voiture, nature: e.target.value })}
              >
                <option value="">Select availability</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Daily Price (€)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the daily price"
                value={voiture.prixJourn}
                onChange={(e) => setVoiture({ ...voiture, prixJourn: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="success" type="submit">
                <i className="fa-regular fa-floppy-disk"></i> Save
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                <i className="fa-solid fa-rotate-left"></i> Reset
              </Button>
              <Link to="/manager">
                <Button variant="danger">
                  <i className="fa-regular fa-circle-xmark"></i> Cancel
                </Button>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Car Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          🚗 The car has been added successfully!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddVoiture;