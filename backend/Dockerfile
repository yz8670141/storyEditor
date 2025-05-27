FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ⬇️ 加這行 debug 看有哪些檔案真的進來
RUN ls -al /app/src

CMD ["node", "src/index.js"]
