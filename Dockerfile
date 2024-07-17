# syntax=docker/dockerfile:1


# Используем версию 22.0.0 Node.js
ARG NODE_VERSION=22.0.0
 
 
# Используем образ Node.js из Docker Hub
FROM node:${NODE_VERSION}-alpine


ENV NODE_ENV=production
 
# Создаем директорию для приложения и устанавливаем ее рабочей
WORKDIR /usr/src/app

RUN mkdir server
RUN mkdir client
 

# SERVER 
# Копируем package.json и package-lock.json
COPY /server/package.json ./server
COPY /server/package-lock.json ./server

# Копируем все файлы сервера в директорию приложения 
COPY ./server ./server

# Устанавливаем зависимости
RUN cd server && npm i

# CLIENT
# Копируем package.json и package-lock.json 
COPY /client/package.json ./client
COPY /client/package-lock.json ./client

# Устанавливаем зависимости
RUN cd client && npm i

# Копируем все файлы клиента в директорию приложения
COPY ./client ./client

# Собираем клиентскую часть
RUN cd ./client && npm run build
 
# Копируем собранную клиентскую часть в директорию сервера
COPY /client/dist ./server/public/dist

# Открываем порт 80
EXPOSE 80

# Запускаем сервер
 CMD ["server", "node app.js"]
