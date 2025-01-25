import React from 'react';
import { useNavigate } from 'react-router-dom';

import "../css/Itemcard.css";

const Itemcard = ({ data }) => {


  const {name, price, category, description, sellerId } = data;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product-details/${data?._id}`, { state: { product: data } });
  };


  return (
    <div className="item-card" onClick={handleClick}>
      <h3 className="item-card-title">{name}</h3>
      <p className="item-card-price">Price: <strong>₹{price}</strong></p>
    </div>
  );
};

export default Itemcard;
