import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/Profilepage.css"
import { FaUserEdit } from "react-icons/fa";
import Edituser from '../components/Edituser';

const Profilepage = () => {
  const [user, setUser] = useState(null); // Initial state for the user
  const [editcomp, seteditcom] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token'); // Or document.cookie, etc.

      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.post("http://localhost:3001/profilepage", {}, {
        withCredentials: true, // Include cookies in the request
        headers: {
          // Explicitly include the token if not using cookies
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data); // Set the fetched use  r data to state
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  return (
    <div className='outside'>
      {user ? (
        <div className="main">
          <h2>YOUR DETAILS</h2>
          <div className="card">
            <div className="card-body">
              <i className=""></i>
              <table>
                <tbody>
                  <tr>
                    <td>First Name</td>
                    <td>:</td>
                    <td>{user.firstName}</td>
                  </tr>
                  <tr>
                    <td>Last Name</td>
                    <td>:</td>
                    <td>{user.lastName}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td>age</td>
                    <td>:</td>
                    <td>{user.age}</td>
                  </tr>
                  <tr>
                    <td>Contact Number</td>
                    <td>:</td>
                    <td>{user.contactNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="edit">
              <FaUserEdit onClick={() => seteditcom(true)} />
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div>
        {
          editcomp && <Edituser formData={user} onclose={() => { seteditcom(false) }} fetchUserData={fetchUserData} />
        }
      </div>

    </div>

  );
};

export default Profilepage;
