
import './App.css';
import { useState } from 'react';
import Verification from './component/verification';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './component/home';
import Dashbord from './component/dashbord';
function App() {

  return (
  
    <Routes>
      <Route path="/" element={<Home />}> </Route>
      <Route path="/verification" element={<Verification />}></Route>
      <Route path="/dashbord" element={<Dashbord />}></Route>
    </Routes>
  );
}

export default App;
