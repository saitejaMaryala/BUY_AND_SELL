import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductCategory from '../helper/ProductCategory';
import "../css/Edituser.css"

const Uploaditem = ({
    onclose,
    fetchallps
}) => {

    const [data, setData] = useState({
        name: "",
        price: '',
        category: "Clothing",
        description: "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/uploaditem", data)
            .then(res => {
                if (res.status === 200) {
                    console.log("Uploaded item")
                    toast.success("Uploaded an item");
                    fetchallps();
                    onclose();
                }
            }).catch(err => {
                console.log("Not uploated error!!", err);
                toast.error("Not uploated error!!")
            });
    }

    return (
        <div className="pop-up-overlay">
            <div className="pop-up">
                <form onSubmit={handleSubmit}>
                    <h2>Enter Deatails of the Item</h2>

                    <label htmlFor="name">name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="name of product"
                        value={data.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Enter Price"
                        value={data.price}
                        onChange={handleChange}
                        min="1" // Ensures age is greater than 0
                        onInvalid={(e) => e.target.setCustomValidity("Age must be greater than 0")}
                        onInput={(e) => e.target.setCustomValidity("")}
                        required
                    />

                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={data.category}
                        onChange={handleChange}
                        required
                    >
                        {
                            ProductCategory.map((el,index)=>{
                                return(
                                    <option value={el.value} key = {el.id}>{el.label}</option>
                                )
                            })
                        }
                    </select>

                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter product description"
                        value={data.description}
                        onChange={handleChange}
                        required
                        rows="4" /* Adjust the number of rows */
                        cols="50" /* Adjust the width */
                    ></textarea>

                    <button type="submit">Upload Item</button>
                </form>
                <div className="cross">
                    <RxCross2 onClick={onclose} />
                </div>
            </div>
        </div>
    )
}

export default Uploaditem