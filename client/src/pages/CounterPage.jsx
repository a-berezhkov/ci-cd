import React from "react";
import Counter from "../components/Counter/Counter";

function CounterPage() {
  return (
    <Counter name="Имя для первого пропса">
      <span>А это то, что уйдет в children</span>
    </Counter>
  );
}

export default CounterPage;
