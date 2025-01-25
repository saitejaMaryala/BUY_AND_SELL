import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddToCart from '../helper/AddToCart';

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.product; // Access passed data
  const navigate = useNavigate();

  const handleAddToCart = async(e,id) => {
    // Logic to add the product to the cart

    // console.log("product id:",id);
    await AddToCart(e,id);
    e.preventDefault();

    // alert(`${product.name} added to cart!`);
  };

  if (!product) {
    return <div>No product details available</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{product.name}</h2>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Seller:</strong> {product.sellerId.firstName}</p>
      <p><strong>Seller Email:</strong> {product.sellerId.email}</p>
      <button onClick={(e)=>handleAddToCart(e,product?._id)} style={{ marginRight: '10px' }}>
        Add to Cart
      </button>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default ProductDetails;
