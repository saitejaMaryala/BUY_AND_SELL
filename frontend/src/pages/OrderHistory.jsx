import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/OrderHistory.css'; // Import the CSS file

const OrderHistory = () => {
    const [soldProducts, setSoldProducts] = useState([]);
    const [boughtProducts, setBoughtProducts] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);

    axios.defaults.withCredentials = true;

    const fetchBoughtAndSold = async () => {
        await axios
            .post('http://localhost:3001/boughtsoldandpending')
            .then((res) => {
                setSoldProducts(res.data.soldprods);
                setBoughtProducts(res.data.boughtprods);
                setPendingProducts(res.data.updatedPendingOrders);  // Set the pending orders here
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    useEffect(() => {
        fetchBoughtAndSold();
    }, []);

    console.log("bought:",pendingProducts);

    return (
        <div className="order-history-container">
            <div className="tabs">
                <button>Sold Items</button>
                <button>Bought Items</button>
                <button>Pending Items</button>
            </div>

            {/* Sold Products Section */}
            <div className="order-section">
                <h2>Sold Products</h2>
                {soldProducts.length > 0 ? (
                    <ul className="order-list">
                        {soldProducts.map((product) => (
                            <li className="order-item" key={product.prodId}>
                                <div className="product-detail">
                                    <span>Product Name:</span> {product.prodId.name}
                                </div>
                                <div className="product-detail">
                                    <span>Price:</span> ${product.prodId.price}
                                </div>
                                <div className="product-detail">
                                    <span>Buyer Name:</span> {product.buyerId.firstName} {product.buyerId.lastName}
                                </div>
                                <div className="product-detail">
                                    <span>Buyer Email:</span> {product.buyerId.email}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No sold products available.</p>
                )}
            </div>

            {/* Bought Products Section */}
            <div className="order-section">
                <h2>Bought Products</h2>
                {boughtProducts.length > 0 ? (
                    <ul className="order-list">
                        {boughtProducts.map((product) => (
                            <li className="order-item" key={product.prodId}>
                                <div className="product-detail">
                                    <span>Product Name:</span> {product.prodId.name}
                                </div>
                                <div className="product-detail">
                                    <span>Price:</span> ${product.prodId.price}
                                </div>
                                <div className="product-detail">
                                    <span>Seller Name:</span> {product.sellerId.firstName} {product.sellerId.lastName}
                                </div>
                                <div className="product-detail">
                                    <span>Seller Email:</span> {product.sellerId.email}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No bought products available.</p>
                )}
            </div>

            {/* Pending Products Section */}
            <div className="order-section">
                <h2>Pending Products</h2>
                {pendingProducts.length > 0 ? (
                    <ul className="order-list">
                        {pendingProducts.map((product) => (
                            <li className="order-item" key={product.prodId}>
                                <div className="product-detail">
                                    <span>Product Name:</span> {product.prodId.name}
                                </div>
                                <div className="product-detail">
                                    <span>Price:</span> ${product.prodId.price}
                                </div>
                                {/* <div className="product-detail">
                                    <span>Buyer Name:</span> {product.buyerId.firstName} {product.buyerId.lastName}
                                </div> */}
                                <div className="product-detail">
                                    <span>Seller Name:</span> {product.sellerId.firstName} {product.sellerId.lastName}
                                </div>
                                <div className="product-detail">
                                    <span>Seller Email:</span> {product.sellerId.email}
                                </div>
                                <div className="product-detail">
                                    <span>OTP:</span> {product.otp ? product.otp : "N/A"}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No pending products available.</p>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
