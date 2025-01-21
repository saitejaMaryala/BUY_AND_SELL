import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import "../css/Edituser.css"

const Edituser = ({
  onclose,
  formData,
  fetchUserData
}) => {

  const [data, setdata] = useState({
    ...formData,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    age: formData.age,
    contactNumber:formData.contactNumber,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/edituser",data)
      .then(res=>{
        if(res.status === 200){
          console.log("updateed")
          onclose();
          fetchUserData();
        }
      }).catch(err=>{
        console.log("Not updated error!!",err);
      });
  }
  return (
    <div className="pop-up-overlay">
      <div className="pop-up">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>

          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={data.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={data.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="example@iiit.ac.in"
            value={data.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Age"
            value={data.age}
            onChange={handleChange}
            required
            min="1"
          />

          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            placeholder="Contact Number"
            value={data.contactNumber}
            onChange={handleChange}
            required
          />

          <button type="submit">Update</button>
        </form>
        <div className="cross">
          <RxCross2 onClick={onclose} />
        </div>
      </div>
    </div>
  )
}

export default Edituser