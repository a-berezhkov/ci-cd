# Deploy с использованием CI/CD on Github Actions

Краткий мануал - https://youtu.be/EmP6b2KYHOE

## Подготовка к деплою

### Настраиваем удаленный сервер

1. Ставим Docker

```bash
apt install docker.io
```

2. Ставим Postgres

Подробнее - https://hub.docker.com/_/postgres

```bash
docker pull postgres

$ docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=someuser -d postgres

```

Так же можно задать том для хранения данных ( что бы в случае удаления контейнера, была возможность их восстановить) с помощью флага `-v pgdata:/var/lib/postgresql/data postgres`

```bash
   docker run -d --name container-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=docker-example -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres
```

**Важно**: после удаления контейнера и создания новых - данные будут браться из `pgdata`, в том числе логин и пароль от базы данных. Поэтому стоит удалить эту папку перед новым монтированием контейнера.

3. Генерим ssh ключ

Подробнее - https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

или

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

4. Добавляем его в авторизированные ключи

```bash
ssh-add ~/.ssh/id_rsa

cd ~/.ssh
cat id_rsa
```

### Подготовка GitHub

Переходим в Settings->Secrets and variables->Actions и добавляем все необходимые переменные

![alt text](/docs/images/github_keys.png)

Secrets для подключения к серверу:

- SERVER_USER -пользователь удаленного сервера (root)
- SERVER_SSH_PORT - порт для подключения к удаленному серверу (22)
- SERVER_SSH_KEY - ключ, который сгенерен ранее (id_rsa); вставляется вместе с строкам `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`
- SERVER_HOST - IP адрес сервера

Secrets для подключения к Docker Hub:

- DOCKER_USERNAME - имя пользователя
- DOCKER_PASSWORD - пароль от аккаунта

Secrets для подключения к базе данных и порт сервера:

- PORT_PROD - порт приложения (80)
- DB_USER_PROD - имя пользователя базы данных
- DB_PASSWORD_PROD - пароль базы данных
- DB_NAME_PROD - имя базы данных
- DB_HOST_PROD - IP адрес базы данных
- DB_DIALECT_PROD - диалект базы данных (postgres)

В файле `server/env.example` есть примеры значений для переменных окружения.

### Подготовка клиента

Перенести в `package.json` пакеты `"vite"` и `"@vitejs/plugin-react-swc"` в секцию `dependencies`. Это необходимо, так как React будем билдить уже в контейнере.

```json
 "dependencies": {
    "vite": "^5.3.1",
     "@vitejs/plugin-react-swc": "^3.5.0"
  },
```

Удалить `proxy` из `./client/vite.config.js`

Добавить в `.env` переменную с адресом API

```env
VITE_APP_API_DEV_URL=http://localhost:3000
```

Далее, в запросах поменять адрес:

```js
axios.get(`${import.meta.env.VITE_APP_API_DEV_URL}/api/tokens/refresh`);
```

### Подготовка сервера

Так как прокси больше не используются, надо настроить CORS

```bash
npm i cors
```
И подключить его в `app.js`

```js
// app.js
const cors = require('cors');

//......

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // if you need to allow cookies
    })
  );
}
```

Таким образом, если у нас не прод (а к примеру, мы используем docker-compose) все наши запросы с клиента на сервер будут работать. 

## Локальный запуск Docker образа (development)

```sh
docker build -t cicd:latest . --platform linux/amd64
```

## Для запуска контейнера

Для локального запуска указываем `NODE_ENV=development` и переменные среды

```sh
docker run -e NODE_ENV=development -e DB_HOST=host.docker.internal -e DB_USER=postgres -e DB_PASSWORD=postgres -e DB_NAME=todo -e DB_DIALECT=postgres -e PORT_DEV=3000  -p 3000:3000 cicd:latest
```

Для заупска на сервере (прод) `NODE_ENV=production`

```sh
docker run -e NODE_ENV=production -e DB_HOST_PROD=111.111.111.111 -e DB_USER_PROD=root -e DB_PASSWORD_PROD=root -e DB_NAME_PROD=todo -e DB_DIALECT_PROD=postgres -e PORT_PROD=80  -p 80:80 cicd:latest
```

## Запуск с использованием CI/CD

Общий процесс

![alt text](/docs/images/deploy2.drawio.png)

Создайте файл в корне проекта `.github/workflows/ci-cd.yml`

Сценарий будет запускать при `push` в `main`

```yml
on:
  push:
    branches:
      - main
```

Далее идет перечень работ (jobs) которые будут выполняться. В примере их две: **build** и **deploy**.

**build** - тестовый запуск проекта

**deploy** - тестовый запуск контейнера и развертывание на сервере

### Build

Сборка на последней версии Ubuntu

```yml
build:
  runs-on: ubuntu-latest

  steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v2
      with:
        context: .
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/express-app:latest
```

### Deploy

```yml
deploy:
  runs-on: ubuntu-latest
  needs: build

  steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Pull Docker image
      run: docker pull ${{ secrets.DOCKER_USERNAME }}/express-app:latest

    - name: Run Docker container
      run: |
        docker run -d -p 80:80 --name express-app ${{ secrets.DOCKER_USERNAME }}/express-app:latest
    - name: Deploy to remote server
      uses: appleboy/ssh-action@v0.1.8
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        port: ${{ secrets.SERVER_SSH_PORT }}
        script: |
          docker pull ${{ secrets.DOCKER_USERNAME }}/express-app:latest
          if [ "$(docker ps -q -f name=express-app)" ]; then
            docker stop express-app
          fi
          if [ "$(docker ps -aq -f name=express-app)" ]; then
            docker rm express-app
          fi
          docker run -d -p 80:80 \
          -e PORT_PROD=${{ secrets.PORT_PROD }} \
          -e DB_HOST_PROD=${{ secrets.DB_HOST_PROD }} \
          -e DB_USER_PROD=${{ secrets.DB_USER_PROD }} \
          -e DB_PASSWORD_PROD=${{ secrets.DB_PASSWORD_PROD }} \
          -e DB_NAME_PROD=${{ secrets.DB_NAME_PROD }} \
          -e DB_DIALECT_PROD=${{ secrets.DB_DIALECT_PROD }} \
          --name express-app ${{ secrets.DOCKER_USERNAME }}/express-app:latest
```

## Запуск проекта с использованием Docker-compose

Docker-compose позволяет запустить контейнеры для разработки, что позволяет использовать единую конфигурацию, вне зависимости от операционной системы.

Основной файл конфигурации - compose.yaml. Он, на основе Docker-файлов собирает и запускает все сервисы.

```yml
# compose.yaml

version: "3.8"
services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.client.dev
    restart: on-failure
    ports:
      - 5173:5173
    volumes:
      - ./client:/usr/src/app/client # мап локальной папки на докер
      - /usr/src/app/client/node_modules # анонимный том, который скрывает каталог node_modules внутри контейнера.
    environment:
      - NODE_ENV=docker
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.server.dev
    restart: on-failure # перезапускать контейнер при падении
    env_file: "./server/.env"
    ports: # открываем порты
      - 3000:3000
    depends_on: # зависимости контейнера
      - db_postgres
    links:
      - db_postgres
    volumes:
      - ./server:/usr/src/app/server # мап локальной папки на докер
      - /usr/src/app/server/node_modules # # анонимный том, который скрывает каталог node_modules внутри контейнера.
    environment:
      - NODE_ENV=docker
    command: >
      sh -c "
      npx sequelize db:drop &&
      npx sequelize db:create &&
      npx sequelize db:migrate &&
      npx sequelize db:seed:all &&
      npm run dev"
  db_postgres: # Важно! Это же имя используется конфиге БД при подключении, как хост
    image: postgres:16 # используемый образ
    env_file: "./server/.env"
    ports: # открываем порты
      - 5432:5432
    volumes: # пробрасываем папку с данными
      - ./db/data:/var/lib/postgresql/data
```

В примере выше у нас три сервиса:

1. frontend
2. backend
3. db_postgres

Каждый сервис берет переменные окружения для среды "docker" из файла `server/.env`.

Процесс сборки выглядит следующим образом:

1. На основе Dockerfile клиента (Dockerfile.client.dev) собирается контейнер с React. При этом React стартует в dev-режиме. Сам локальный том `client` монтируется на сервер, как том `usr/src/app/client`
2. Собирается образ postgres
3. На основе Dockerfile клиента (Dockerfile.server.dev ) собирается контейнер с Express. При этом Express стартует в dev-режиме. Сам локальный том `server` монтируется на сервер, как том `usr/src/app/server`. После чего применяются миграции и сиды `sequelize`

После сборки стартует три сервиса, и любые изменения в локальных файлах проекта будут отображены на сервере Docker.

Для запуска используйте команду:

```
docker-compose up --build
```

Для очистки томов и удаления контейнеров команду:

```
docker-compose down --rmi all --volumes --remove-orphans
```
