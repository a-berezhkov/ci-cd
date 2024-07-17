import axios from "axios";

//  Создаем экземпляр axios

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = ''; // Токен доступа

function SetAccessToken(token) {
  accessToken = token; // Устанавливаем токен доступа
   
}

/// В каждый запрос добавляет заголовок Authorization
axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//  Перехватывает ответы сервера и обрабатывает ошибку 403
axiosInstance.interceptors.response.use(
  (response) => response, // Возвращает ответ, если нет ошибок
  async (error) => { // Обрабатывает ошибку
    const prevRequest = error.config; // Получаем предыдущий запрос из ошибки 
    if (error.response.status === 403 && !prevRequest.sent) { // Если ошибка 403 и запрос не отправлен
      const response = await axios('/api/tokens/refresh'); // Отправляем запрос на обновление токена
      accessToken = response.data.accessToken; // Получаем новый токен доступа  
      prevRequest.sent = true; // Устанавливаем флаг отправки запроса в true
      prevRequest.headers.Authorization = `Bearer ${accessToken}`; // Устанавливаем новый токен доступа в заголовок
      return axiosInstance(prevRequest); // Повторно отправляем запрос с новым токеном доступа 
    }
    return Promise.reject(error);
  },
);



export { SetAccessToken };
export default axiosInstance;


 