# 1단계: 빌드
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실제 서비스 (Nginx 사용)
FROM nginx:alpine

# Nginx 설정 파일 덮어쓰기 (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# React 빌드 결과를 Nginx 웹 루트로 복사
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
