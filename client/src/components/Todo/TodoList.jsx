import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import axios from "axios";
import CategoryDropDown from "../Category/CategoryDropDown";
import { useGetTodosQuery } from "../../features/api/apiSlice";
import axiosInstance from "../../services/axiosInstance";

function TodoList() {
  const [todo, setTodo] = useState([]);
  const [form, setForm] = useState({
    title: "",
    isDone: false,
    categoryId: null,
  });

  useEffect(() => {
    loadToDos();
  }, []);

  const loadToDos = async () => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_APP_API_DEV_URL}/api/todos`);
      if (result.status === 200) {
        setTodo(result.data.todos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createToDoHandler = async (e) => {
    e.preventDefault();
    if (form.title.trim() === "") {
      alert("Заполните поле!!! ");
      return;
    }

    try {
      const result = await axiosInstance.post(`${import.meta.env.VITE_APP_API_DEV_URL}/api/todos`, form);
      if (result.status === 201) {
        setTodo((prev) => [...prev, result.data.todo]);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        style={{
          border: "1px grey solid",
          padding: "15px",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
        onSubmit={(e) => createToDoHandler(e)}
      >
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="title">Название задачи</label>
            <input
              type="text"
              className="form-control"
              id="title"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            ></input>
          </div>
          <div className="col-md-4">
            <CategoryDropDown
              state={form.categoryId}
              setState={(e) =>
                setForm((prev) => ({ ...prev, categoryId: e.target.value }))
              }
            />
          </div>

          <div className="col-md-2">
            <div
              className="form-check form-switch"
              style={{ marginTop: "30px" }}
            >
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="isDone"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isDone: e.target.checked }))
                }
              />
              <label className="form-check-label" htmlFor="idDone">
                Выполнена
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Добавить
        </button>
      </form>
      <hr />
      {todo.map((item) => (
        <ul key={item.id} className="list-group list-group-flush">
          <TodoItem item={item} setTodo={setTodo} />
        </ul>
      ))}
    </div>
  );
}

export default TodoList;
