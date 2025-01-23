import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../css/Cart.css'; // Import a CSS file for custom styles

const Cart = () => {
  axios.defaults.withCredentials = true;

  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:3001/addtocartview", {});
      setData(res.data.data);
      calculateTotal(res.data.data);
      // console.log(res.data.data);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to fetch cart data!");
    }
  };

  const removeFromCart = async (id) => {
    await axios.post("http://localhost:3001/deletefromcart", { _id: id })
      .then(res => {
        if (res.data.success) {
          fetchData();
        }
      }).catch(err => {
        console.log(err);
      });
  }

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.productId.price, 0);
    setTotalAmount(total);
  };

  const handleCheckout = async (prodIds,prodsearchIds) => {

    await axios.post("http://localhost:3001/checkoutcart", { prodIds: prodIds,prodsearchIds:prodsearchIds })
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message+" "+res.data.deletedCount);
          fetchData();
        }
      }).catch(err => {
        console.log(err);
      });

    
    // Redirect to checkout page or handle the checkout logic here
  };

  const prodIds = data.map(item => item._id);
  const prodsearchIds = data.map(item => item.productId._id);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>
        {data.length === 0 ? (
          <div className="empty-cart">Cart is Empty</div>
        ) : (
          <div className="cart-items">
            {data.map((product, index) => (
              <div className="cart-item" key={index}>
                <div className="item-details">
                  <h3 className="item-name">{product.productId.name}</h3>
                  <p className="item-price">Price: ₹{product.productId.price}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(product._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        {data.length > 0 && (
          <div className="cart-summary">
            <h2>Total Amount: ₹{totalAmount}</h2>
            <button className="checkout-btn" onClick={()=>handleCheckout(prodIds,prodsearchIds)}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
