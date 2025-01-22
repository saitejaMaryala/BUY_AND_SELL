import React from 'react'
import { toast } from 'react-toastify'

const Cart = () => {
  return (
    <div className='cart-body'>Cart
      <button onClick={() => toast.success("Test Notification!")}>Test Toast</button>
    </div>
  )
}

export default Cart