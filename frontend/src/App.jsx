import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profilepage from './pages/Profilepage';
import Searchitems from './pages/Searchitems';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';


export const Setauth = createContext(null);
export const Settoken = createContext(null);
export const Isauth = createContext(null);

function App() {

  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Retrieve token from localStorage

  useEffect(() => {
    if (!token) {
      setAuth(false);
      return;
    }

    axios
      .get('http://localhost:3001',
       {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      )
      .then((response) => {
        if (response.status == 200) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setAuth(false);
      });
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
                    <Cart/>
                  </ProtectedRoute>
                }
              />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </BrowserRouter>
        </Settoken.Provider>
      </Setauth.Provider>
    </Isauth.Provider>
  );
}

export default App;
