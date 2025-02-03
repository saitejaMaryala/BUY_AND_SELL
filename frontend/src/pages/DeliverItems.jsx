import axios from 'axios';
import "../css/DeliverItems.css";
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";

const DeliverItems = () => {

    const [pendingdelivers, setPendingdelivers] = useState([]);
    const [otpValues, setOtpValues] = useState({}); // Store OTP inputs for each product

    axios.defaults.withCredentials = true;

    const handleOtpSubmit = (e, prodId) => {
        e.preventDefault(); // Prevent form submission from reloading the page

        const otp = otpValues[prodId]; // Get OTP for the specific product
        if (!otp) {
            toast.error("Please enter OTP before submitting");
            return;
        }

        console.log("Submitting OTP and prodID", otp, prodId);
        axios.post("http://localhost:3001/completedeliver", { otp, prodId })
            .then(res => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    setOtpValues(prev => ({ ...prev, [prodId]: "" })); // Clear OTP after successful submission
                    fetchpendingdelivers();
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.log(err.message || err);
                toast.error("Error submitting OTP");
            });
    };

    const fetchpendingdelivers = async () => {
        await axios.post("http://localhost:3001/deliveritems")
            .then(res => {
                if (res.data.success) {
                    setPendingdelivers(res.data.data);
                }
            }).catch(err => {
                console.log(err.message || err);
            })
    };

    useEffect(() => {
        fetchpendingdelivers();
    }, []);

    return (
        <>
            <div className="deliver-items-container">
                <h2 className="deliver-items-title">Pending Deliveries</h2>
                {pendingdelivers.length > 0 ? (
                    <div className="deliver-items-grid">
                        {pendingdelivers.map((product) => (
                            <div className="deliver-item-card" key={product.prodId}>
                                <h3 className="product-name">{product.prodId.name}</h3>
                                <p className="product-detail"><span>Price:</span> ${product.prodId.price}</p>
                                <p className="product-detail"><span>Category:</span> {product.prodId.category}</p>
                                <p className="product-detail"><span>Buyer Name:</span> {product.buyerId.firstName}</p>
                                <p className="product-detail"><span>Buyer Email:</span> {product.buyerId.email}</p>
                                <form onSubmit={(e) => handleOtpSubmit(e, product.prodId._id)}>
                                    <input
                                        name={`otp-${product.prodId._id}`}
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otpValues[product.prodId._id] || ""}
                                        onChange={(e) => setOtpValues(prev => ({ ...prev, [product.prodId._id]: e.target.value }))}
                                    />
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-items">No pending deliveries.</p>
                )}
            </div>
        </>
    );
};

export default DeliverItems;
