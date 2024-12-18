import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ListCars from './components/cars/ListCars';
import './App.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import HomePage from './components/cars/HomePage';
// import CarRentalPage from './components/cars/CarRentalPage';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import Dashboard from './components/Dashboard/Dashboard';
import AddCar from './components/Dashboard/AddCar';
import UpdateCar from './components/manager/UpdateCar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';
import SearchResults from './components/cars/SearchResults';
import AdminPage from './components/admin/AdminPage';
import AddAgence from './components/agence/add-agence';
import ListAgences from './components/agence/list-agences';
import AgenceDetails from './components/agence/AgenceDetails';
import ManagerPage from './components/admin/ManagerPage';
import ListAgencies from './components/client/ListAgencies';
// import RentCar from './components/client/RentCar';
import Payment from './components/client/Payment';
import ClientLocations from './components/client/ClientLocations';
import AddLocation from './components/client/AddLocation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ConditionalMenu />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/cars" element={<ProtectedRoute><ListCars /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute><ManagerPage /></ProtectedRoute>} />
          {/* <Route path="/reserve/:id" element={<ProtectedRoute><CarRentalPage /></ProtectedRoute>} /> */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
          <Route path="/add-agence" element={<ProtectedRoute><AddAgence /></ProtectedRoute>} />
          <Route path="/list-agences" element={<ProtectedRoute><ListAgences /></ProtectedRoute>} />
          <Route path="/detail-agence" element={<ProtectedRoute><AgenceDetails /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><UpdateCar /></ProtectedRoute>} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/agencies" element={<ListAgencies />} />
          <Route path="/agencies/:agencyId/cars" element={<ListCars />} />
          <Route path="/add-location" element={<AddLocation />} />
        <Route path="/client-locations" element={<ClientLocations />} />
        <Route path="/payment/:id" element={<Payment />} />

        </Routes>
        <ConditionalFooter />
      </Router>
    </AuthProvider>
  );
}

function ConditionalMenu() {
  const location = useLocation();
  const hideMenuPaths = ["/login", "/signup", "/dashboard", "/edit"];
  return !hideMenuPaths.some(path => location.pathname.startsWith(path)) ? <Menu /> : null;
}

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/signup", "/dashboard", "/edit","/admin","/manager", "/add-agence","/list-agences","/detail-agence"];
  return !hideFooterPaths.some(path => location.pathname.startsWith(path)) ? <Footer /> : null;
}

export default App;