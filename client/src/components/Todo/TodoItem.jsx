import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function TodoItem({ item, setTodo }) {
  const [isUpdate, setIsUpdate] = useState(false);

  const deleteToDoHandler = async (itemId) => {
    try {
      const result = await axios.delete(`${import.meta.env.VITE_APP_API_DEV_URL}/api/todos/${itemId}`);
      if (result.status === 200) {
        if (result.data.todo > 0) {
          setTodo((prevTodo) =>
            prevTodo.filter((prevItem) => prevItem.id !== itemId)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateToDoHandler = async (e, itemId) => {
    /// получить  новые данные из поля
    const dataFromInput = e.target.value;

    //todo  состояние , это массив [{}, {}, {}]
    //item элемент массив = {}
    try {
      const result = await axios.put(`${import.meta.env.VITE_APP_API_DEV_URL}/api/todos/${itemId}`, {
        title: dataFromInput,
      });
      if (result.status === 200) {
        setTodo((prevValueState) =>
          prevValueState.map((prevItem) => {
            if (itemId === prevItem.id) {
              return { ...prevItem, title: dataFromInput };
            }
            return prevItem;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }

    // Обновить состояние со всеми задачами, поставив новой задачи новое имя
  };

  return (
    <li
      className="list-group-item"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div>
        <p>
          {/* 
              Делаем ссылку на просмотр одной карточки 
              Для того что бы работал роут см. файл main.jsx
              Это аналог параметризованных запросов на Express
                {
                  path: "todoitem/:id",
                  element: <ToDoItemPage/>,
                 },
          */}
          <Link style={{paddingRight: "20px"}} to={`/todoitem/${item.id}`}> {item.title}</Link>
          {item.isDone ? (
            <span className="badge text-bg-success">Выполнено</span>
          ) : (
            <span className="badge text-bg-danger">Не выполнено</span>
          )}
        </p>
      </div>
      <div>
        <button
          className="btn btn-danger"
          onClick={() => deleteToDoHandler(item.id)}
        >
          Удалить
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setIsUpdate((prev) => !prev)}
        >
          Обновить
        </button>
      </div>
      {isUpdate && (
        <input
          type="text"
          onChange={(event) => updateToDoHandler(event, item.id)}
          value={item.title}
        ></input>
      )}
    </li>
  );
}

export default TodoItem;
