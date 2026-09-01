# ---------- Stage 1: build ----------
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_BACKEND_URL
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_AGORA_APP_ID
ARG VITE_SOCKET_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_AGORA_APP_ID=$VITE_AGORA_APP_ID
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]