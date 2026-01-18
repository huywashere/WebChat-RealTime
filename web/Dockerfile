# Hình ảnh nút để xây dựng ứng dụng React
FROM node:14 AS build
WORKDIR /app

# Khai báo các đối số được truyền từ docker-compose
ARG NGINX_ENV
ARG NGINX_HOST
ARG NGINX_PORT

# Đặt biến môi trường
ENV REACT_APP_NGINX_ENV=$NGINX_ENV
ENV REACT_APP_NGINX_HOST=$NGINX_HOST
ENV REACT_APP_NGINX_PORT=$NGINX_PORT

COPY package.json package-lock.json ./
RUN npm install --verbose
COPY . ./
RUN npm run build

# Hình ảnh cuối cùng sử dụng các tệp tĩnh từ bước xây dựng
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
