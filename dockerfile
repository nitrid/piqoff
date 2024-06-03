# Aşama 1: Frontend Build
FROM node:16 AS build

# Çalışma dizinini ayarla
WORKDIR /

# Frontend bağımlılıklarını yükle
COPY www/package*.json ./www/
WORKDIR /www
RUN npm install --force

# Frontend dosyalarını kopyala ve build işlemini gerçekleştir
COPY www /www
RUN npm run build

# Aşama 2: Backend Setup
FROM node:16

# Çalışma dizinini ayarla
WORKDIR /

# Backend bağımlılıklarını yükle
COPY package*.json ./
RUN npm install

# Tüm dosyaları kopyala (archiveFiscal hariç)
COPY . .
RUN rm -rf archiveFiscal

# Backend uygulamasını başlat
CMD ["node", "server.js"]