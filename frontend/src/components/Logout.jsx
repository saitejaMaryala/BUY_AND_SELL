import React, { useContext } from 'react'
import "../css/logout.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Setauth, Settoken } from '../App'


const Logout = () => {
  const navigate = useNavigate();
  const setauth = useContext(Setauth);
  const setToken = useContext(Settoken);

  axios.defaults.withCredentials = true;

  const handleDelete = async () => {
    await axios.get("http://localhost:3001/logout")
      .then(res => {
        setToken('');
        localStorage.removeItem('token');
        setauth(false);
        location.reload(true);
      }).catch(err => {
        console.log(err);
      })
  }


  return (
    <button onClick={handleDelete}>Logout</button>
  )
}

export default Logout