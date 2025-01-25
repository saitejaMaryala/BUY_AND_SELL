import React, { useEffect, useState } from "react";
import Uploaditem from "../components/Uploaditem";
import { GoSearch } from "react-icons/go";
import { toast } from 'react-toastify'  

import "../css/Searchitems.css";
import axios from "axios";
import Itemcard from "../components/Itemcard";
import ProductCategory from "../helper/ProductCategory";

const Searchitems = () => {
  const [allproducts, setallproducts] = useState([]);
  const [temptxt, settemptext] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploaditem, setuploaditem] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchText(temptxt);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const fetchallproducts = async () => {
    await axios
      .get("http://localhost:3001/getproduct", {})
      .then((res) => {
        // console.log(res.data.data);
        setallproducts(res?.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchallproducts();
  }, []);

  const filteredProducts = allproducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="search-items-container">
        <div className="spage">
          <h2>Products</h2>
          <form onSubmit={handleSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={temptxt}
              onChange={(e) => settemptext(e.target.value)}
            />
            <button type="submit">
              <GoSearch />
            </button>
          </form>

          <button onClick={() => setuploaditem(true)}>Upload Product</button>
        </div>

        <div className="category-container">
            <div className="category-checkboxes">
              {ProductCategory.map((el) => (
                <div key={el.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={el.id}
                    value={el.value}
                    onChange={() => handleCategoryChange(el.value)}
                    checked={selectedCategories.includes(el.value)}
                  />
                  <label htmlFor={el.id}>{el.label}</label>
                </div>
              ))}
            </div>
          </div>

        {uploaditem && <Uploaditem onclose={() => setuploaditem(false)} fetchallps={fetchallproducts} />}


        <div className="item-card-container">
          {filteredProducts.map((product, index) => (
            <Itemcard data={product} key={index + "productsall"} />
          ))}
        </div>
        {/* <button onClick={() => toast.error("Test Notification!")}>Test Toast</button> */}
      </div>
    </>
  );
};

export default Searchitems;
