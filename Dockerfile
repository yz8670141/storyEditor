# 建置 Vue 前端專案
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 用 Nginx 伺服器跑前端
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
