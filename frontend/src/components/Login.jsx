import "../css/Login.css"
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from "react";
import axios from 'axios';
import { Setauth, Settoken } from "../App";
import {toast} from "react-toastify";


function Login() {

    const setauth = useContext(Setauth);
    const setToken = useContext(Settoken);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", { email, password })
            .then(result => {
                if (result.status == 200) {
                    setToken('token');
                    localStorage.setItem('token', result.data.token);
                    setauth(true);
                    toast.success("Login success!")
                    navigate('/profilepage');
                } else {
                    // alert(result.data.message); // Access the message property
                    toast.error(result.data.message)
                }
            })
            .catch(err => {
                // If the error response contains data, show it
                if (err.response && err.response.data && err.response.data.message) {
                    // alert(err.response.data.message);
                    toast.error(err.response.data.message);
                } else {
                    console.error(err);
                    toast.error("unexpected error!!");
                }
            });
    };


    return (
        <>
            <div className="lr">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email ID</label>
                    <input type="text" id="email" name="email" placeholder="name@some.iiit.ac.in" onChange={(e) => { setEmail(e.target.value) }} />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="*******" onChange={(e) => setPassword(e.target.value)} />
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                    <button type="submit"> submit </button>
                </form>

            </div>

        </>
    )
}

export default Login;