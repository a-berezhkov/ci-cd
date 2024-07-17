import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function CategoryDropDown({ state, setState }) {
  const [categoryItems, setCategoryItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_DEV_URL}/api/categories`)
      .then((data) => setCategoryItems(data.data.categories));
  }, []);
  return (
    <>
      <label htmlFor="category">Категория</label>
      <select id="category" onChange={setState} className="form-control">
        {categoryItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
    </>
  );
}

export default CategoryDropDown;
