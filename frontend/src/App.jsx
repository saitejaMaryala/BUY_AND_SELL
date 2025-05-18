import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { ToastContainer } from "react-toastify";
import axios from 'axios';

import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profilepage from './pages/Profilepage';
import Searchitems from './pages/Searchitems';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetails from './pages/ProductDetails';
import api from './helper/api';
import OrderHistory from './pages/OrderHistory';
import DeliverItems from './pages/DeliverItems';
import Support from './pages/Support';


export const Setauth = createContext(null);
export const Settoken = createContext(null);
export const Isauth = createContext(null);

function App() {
  const [auth, setAuth] = useState(undefined);
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Retrieve token from localStorage

  const authcheck = async () => {
    try {
      const response = await axios.get('/');
      if (response.status === 200) {
        setAuth(true);
        console.log("set auth value true in app.jsx", response.status);
      } else {
        setAuth(false);
        console.log("set auth value false in app.jsx");
      }
    } catch (err) {
      console.error("Error in authcheck:", err.response?.status || err.message);
      setAuth(false);
    }
  };
  useEffect(() => {
    if (!token) {
      setAuth(false);
      return;
    }
    authcheck();
  }, [token]); // Re-run if token changes

  if (auth === undefined) {
    // Show a global loading state while verification is in progress
    return <div>Loading...</div>;
  }



  return (
    <Isauth.Provider value={auth}>
      <Setauth.Provider value={setAuth}>
        <Settoken.Provider value={setToken}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={auth ? <Navigate to="/profilepage" /> : <Navigate to="/login" />} />
              <Route path="/login" element={auth ? <Navigate to="/profilepage" /> : <Login />} />
              <Route path="/register" element={auth ? <Navigate to="/profilepage" /> : <Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/profilepage"
                element={
                  <ProtectedRoute auth={auth}>
                    <Profilepage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/searchitems"
                element={
                  <ProtectedRoute auth={auth}>
                    <Searchitems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute auth={auth}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/orderhistory'
                element={
                  <ProtectedRoute auth={auth}>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/product-details/:id'
                element={
                  <ProtectedRoute auth={auth}>
                    <ProductDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/deliveritems'
                element={
                  <ProtectedRoute auth={auth}>
                    <DeliverItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/support'
                element={
                  <ProtectedRoute auth={auth}>
                    <Support />
                  </ProtectedRoute>
                }
              />
              <Route path="/logout" element={<Logout />} />
            </Routes>
            <ToastContainer position='top-center' />
          </BrowserRouter>
        </Settoken.Provider>
      </Setauth.Provider>
    </Isauth.Provider>
  );
}

export default App;
