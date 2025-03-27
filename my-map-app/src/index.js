import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateHouse from './pages/createHouse/createHouse.jsx';
import Login from './pages/login/Login.jsx';
import Footer from './components/footer/Footer.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/createHouse" element={<CreateHouse />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  </BrowserRouter>
);

