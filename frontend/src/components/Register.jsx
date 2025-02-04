import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import "../css/Login.css"


function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        contactNumber: '',
        password: '',
    });

    const [confirmpassword,setconfirmpassword] = useState();

    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(confirmpassword !== formData.password){
            toast.error("confirm passsword didn't match");
            return;
        }

        // Validate email for IIIT domain
        const iiitEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]*iiit\.ac\.in$/;
        if (!iiitEmailRegex.test(formData.email)) {
            alert('Please enter a valid IIIT email address!');
            return;
        }

        axios.post("http://localhost:3001/register", { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, age: formData.age, contactNumber: formData.contactNumber, password: formData.password })
            .then(result => {
                if (result.status == 201) {
                    console.log('user created successfully')
                    toast.success("Success!!");
                    navigate("/login")
                }
            }).catch(err => {
                if (err.response && err.response.status == 400) {
                    toast.error("email already exists!!");
                } else {
                    toast.error(err);
                }
            })

    };

    return (
        <>
            <div className="lr">

                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="example@iiit.ac.in"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="1" // Ensures age is greater than 0
                        onInvalid={(e) => e.target.setCustomValidity("Age must be greater than 0")}
                        onInput={(e) => e.target.setCustomValidity("")}
                    />

                    <label htmlFor="contactNumber">Contact Number</label>
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="Contact Number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        pattern="\d{10}" // Ensures exactly 10 digits
                        onInvalid={(e) => e.target.setCustomValidity("Contact number must be exactly 10 digits")}
                        onInput={(e) => e.target.setCustomValidity("")}
                    />


                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="*******"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor='confirmpassword'>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmpassword"
                        name="confirmpassword"
                        placeholder="*******"
                        value={confirmpassword}
                        onChange={(e)=>setconfirmpassword(e.target.value)}
                        required
                    />

                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );
}

export default Register;
