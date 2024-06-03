# Aşama 1: Frontend Build
FROM node:16 AS build

# Çalışma dizinini ayarla
WORKDIR /app

# Frontend bağımlılıklarını yükle
COPY www/package*.json ./www/
WORKDIR /app/www
RUN npm install --force

# Frontend'i derle
COPY www /app/www
RUN npm run build

# Aşama 2: Backend Setup
FROM node:16

# Çalışma dizinini ayarla
WORKDIR /app

# Backend bağımlılıklarını yükle
COPY package*.json ./
RUN npm install

# Tüm dosyaları kopyala (archiveFiscal hariç)
COPY . .
RUN rm -rf archiveFiscal

# EntryPoint betiğini kopyala
# COPY entrypoint.sh /app/entrypoint.sh
# RUN chmod +x /app/entrypoint.sh

# Giriş noktasını ayarla
# ENTRYPOINT ["/app/entrypoint.sh"]

# Backend uygulamasını başlat
CMD ["node", "server.js"]
