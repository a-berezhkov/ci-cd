import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function ToDoItemPage() {
  const [todoItem, setTodoItem] = useState(null);
  const { id } = useParams(); // Получаем id из URL, используя хук useParams из react-router-dom

  useEffect(() => {
    // Получаем данные о задаче по id
    axios.get(`${import.meta.env.VITE_APP_API_DEV_URL}/api/todos/${id}`).then((response) => {
      setTodoItem(response.data.todo);
    });
  }, [id]); // При изменении id выполняем какой-то код

  return (
    <>
      {todoItem ? (
        <div>
          <h1>Title: {todoItem.title}</h1>
          <p>isDone: {todoItem.isDone ? "Выполнено" : "Не выполнено"}</p>
          <p>Category ID: {todoItem.categoryId}</p>
        </div>
      ) : (
        <h1>Загрузка...</h1>
      )}
    </>
  );
}

export default ToDoItemPage;
