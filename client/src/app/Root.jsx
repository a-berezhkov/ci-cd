import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../context/userContext";
import axiosInstance, { SetAccessToken } from "../services/axiosInstance";
import axios from "axios";

function Root() {
  const { user, setUser } = useUser();
  useEffect(() => {
    // или loader route
    axios.get(`${import.meta.env.VITE_APP_API_DEV_URL}/api/tokens/refresh`).then((data) => {
      console.log(data);
      const { accessToken, user } = data.data;
      setUser(user);
      SetAccessToken(accessToken);
    });
  }, []);
  return (
    <>
      <nav
        style={{ height: "100px" }}
        className="navbar navbar-expand-lg bg-body-tertiary"
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to={"/todolist"}>
                  Перейти к тодо  
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/counter"}>
                  {" "}
                  Перейти к коунтер
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/auth"}>
                  {" "}
                  Авторизация
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/reg"}>
                  {" "}
                  Регистрация
                </Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <span>{user?.email}</span>
            </form>
          </div>
        </div>
      </nav>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default Root;
