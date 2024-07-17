import React, { createContext, useState, useContext, ReactNode } from "react";
import { useEffect } from "react";

export const UserContext = createContext({}); // Создаем контекст

export const UserProvider = ({ children }) => {
  // функция-провайдер для контекста
  // Помним, что children - это все, что находится внутри компонента, в данном случае - это  будет все наше приложение
  const [user, setUser] = useState(null); // Здесь храним пользователя

  useEffect(() => {});
  // Что бы к нам не пришло в компонент UserProvider обертываем все в UserContext.Provider
  // Тогда все что находится внутри UserProvider будет иметь доступ к значению user и setUser
  // Далее используем это в main.jsx
  // вот эти строки
  //   <UserProvider>
  //   <Root />
  // </UserProvider>
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}  
    </UserContext.Provider>
  );
};

export const useUser = () => {
  // useContext - Хук для использования контекста , чем то похож на useState
  // Возвращает текущее значение контекста для этого контекста
  // Так как у нас контекст выше задается как объект {user, setUser}
  // то в переменной context будет объект {user: {…}, setUser: ƒ}
  const context = useContext(UserContext); // context = { user, setUser }

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  // Его и возвращаем
  // Таким образом, вызов этой функции вернет пользователя user (если он есть)
  // и функцию setUser для его установки
  return context; // { user, setUser }
};
