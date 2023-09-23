import React from 'react'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element = {<Home/>} />
          <Route path="/register" element ={<Register />} />
          <Route path="/login" element ={<Login />} />
        </Routes>      
      </Router>      
    </div>
  )
}

export default App
