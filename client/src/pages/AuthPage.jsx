import axios from "axios";
import React from "react";
import { useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { SetAccessToken } from "../services/axiosInstance";

function Auth() {
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const { user, setUser } = useUser();

  /**
   * Хук из библиотеки react-router-dom, который позволяет переходить по страницам
   * https://reactrouter.com/en/main/hooks/use-navigate
   */
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) {
      alert("Заполните все поля");
      return;
    }
    try {
      const result = await axios.post(`${import.meta.env.VITE_APP_API_DEV_URL}/api/auth/login`, authForm);
      if (result.status === 200) {
        setUser(result.data.user); // см. файл /src/context/userContext.js
        SetAccessToken(result.data.accessToken)
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
              setAuthForm((prev) => ({ ...prev, email: e.target.value }))
            }
          ></input>
        </label>
        <label>
          Password
          <input
            type="password"
            className="form-control"
            onChange={(e) =>
              setAuthForm((prev) => ({ ...prev, password: e.target.value }))
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

export default Auth;
