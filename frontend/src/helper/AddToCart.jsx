import axios from 'axios';
import React from 'react'
import { toast } from 'react-toastify'

const AddToCart = async(e,id) => {

    e?.stopPropagation();
    e?.preventDefault();

    axios.defaults.withCredentials = true;

    // console.log("product id in addtocart:",id);

    axios.post("http://localhost:3001/addtocart",{productId:id})
            .then(res=>{
                if(res.data.success){
                    toast.success(res.data.message);
                }else{
                    toast.error(res.data.message);
                }
            }).catch(err=>{
                toast.error(err.message);
                console.log(err);
            })
  return (
    <div>AddToCart</div>
  )
}

export default AddToCart