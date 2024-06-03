# Aşama 1: Frontend Build
FROM mcr.microsoft.com/windows/servercore:ltsc2022 AS build

# Node.js'i Windows üzerinde yüklemek
RUN powershell -Command " \
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; \
    Invoke-WebRequest -Uri https://nodejs.org/dist/v16.14.0/node-v16.14.0-x64.msi -OutFile nodejs.msi; \
    Start-Process msiexec.exe -ArgumentList '/i nodejs.msi /quiet /norestart' -Wait; \
    Remove-Item -Force nodejs.msi"

# Çalışma dizinini ayarla
WORKDIR /app

# Frontend bağımlılıklarını yükle
COPY www/package*.json ./www/
WORKDIR /app/www
RUN npm install --force

# Frontend dosyalarını kopyala ve build işlemini gerçekleştir
COPY www /app/www
RUN npm run build

# Aşama 2: Backend Setup
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Node.js'i Windows üzerinde yüklemek
RUN powershell -Command " \
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; \
    Invoke-WebRequest -Uri https://nodejs.org/dist/v16.14.0/node-v16.14.0-x64.msi -OutFile nodejs.msi; \
    Start-Process msiexec.exe -ArgumentList '/i nodejs.msi /quiet /norestart' -Wait; \
    Remove-Item -Force nodejs.msi"

# Çalışma dizinini ayarla
WORKDIR /app

# Backend bağımlılıklarını yükle
COPY package*.json ./
RUN npm install

# Tüm dosyaları kopyala (archiveFiscal hariç)
COPY . .
RUN powershell -Command "Remove-Item -Recurse -Force archiveFiscal"

# Backend uygulamasını başlat
CMD ["node", "server.js"]
