import React, { useState } from "react";
import "./Counter.css";
function Counter({ name, children }) {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);

  return (
    <>
      <p> count is {count}</p>
      <input
        type="number"
        onChange={(e) => {
          setValue(+e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
        className="button_blue"
        type="button"
      >
        {children}
      </button>
      <button
        onClick={() => setCount((count) => count - value)}
        className="button_blue"
        type="button"
      >
        {name}
      </button>
    </>
  );
}

export default Counter;
