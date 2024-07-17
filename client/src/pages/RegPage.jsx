import React from "react";
import { useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegPage() {
  /**
   * Хук из библиотеки react-router-dom, который позволяет переходить по страницам
   * https://reactrouter.com/en/main/hooks/use-navigate
   */
  const navigate = useNavigate();

  const [regForm, setRegForm] = useState({
    email: "",
    password: "",
    rpassword: "",
    login: "",
  });
  const { user, setUser } = useUser();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      !regForm.email ||
      !regForm.password ||
      !regForm.rpassword ||
      !regForm.login
    ) {
      alert("Заполните все поля");
      return;
    }
    if (regForm.password !== regForm.rpassword) {
      alert("Пароли не совпадают");
      return;
    }
    try {
      const result = await axios.post(`${import.meta.env.VITE_APP_API_DEV_URL}/api/auth/registration`, regForm);
      if (result.status === 201) {
        setUser(result.data.user); // См. файл /src/context/userContext.js
        navigate("/"); // Переход на главную страницу используя хук navigate
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label>
          E-mail
          <input
            type="text"
            className="form-control"
            onChange={(e) =>
              setRegForm((prev) => ({ ...prev, email: e.target.value }))
            }
          ></input>
        </label>
        <label>
          Логин
          <input
            type="text"
            className="form-control"
            onChange={(e) =>
              setRegForm((prev) => ({ ...prev, login: e.target.value }))
            }
          ></input>
        </label>
        <label>
          Пароль
          <input
            type="password"
            className="form-control"
            onChange={(e) =>
              setRegForm((prev) => ({ ...prev, password: e.target.value }))
            }
          ></input>
        </label>

        <label>
          Повторите пароль
          <input
            type="rpassword"
            className="form-control"
            onChange={(e) =>
              setRegForm((prev) => ({ ...prev, rpassword: e.target.value }))
            }
          ></input>
        </label>
        <button type="submit" className="btn btn-primary">
          Отправить
        </button>
      </form>
    </div>
  );
}

export default RegPage;
