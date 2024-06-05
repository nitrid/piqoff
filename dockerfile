# Aşama 1: Frontend Build
FROM node:16 AS build

# Çalışma dizinini ayarla
WORKDIR /app

# Frontend bağımlılıklarını yükle
COPY www/package*.json ./www/
WORKDIR /app/www
RUN npm install --force --verbose

# Frontend dosyalarını kopyala ve build işlemini gerçekleştir
COPY www /app/www
RUN npm run build

# .NET SDK image to build the DevPrint application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS dotnet-build

# Çalışma dizinini ayarla
WORKDIR /src

# .NET proje dosyalarını kopyala ve restore et
COPY plugins/devprint/net6/net6/ plugins/devprint/net6/net6/
RUN dotnet restore plugins/devprint/net6/net6/net6.csproj

# .NET uygulamasını build ve publish et
RUN dotnet publish plugins/devprint/net6/net6/net6.csproj -c Release -o /app/plugins/devprint/lib

# Final stage: Combine Node.js and .NET runtime
FROM node:16 AS final

# .NET 6.0 runtime'ı kurmak
RUN curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime dotnet --version 6.0.0

# .NET 8.0 runtime'ı kurmak
RUN curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime dotnet --version latest

# .NET runtime'ın PATH'e eklenmesi
ENV PATH="/root/.dotnet:/root/.dotnet/tools:$PATH"

# Çalışma dizinini ayarla
WORKDIR /app

# Backend bağımlılıklarını yükle
COPY package*.json ./
RUN npm install --force --verbose

# Back-end dosyalarını kopyala
COPY . .

# .NET uygulamasını kopyala
COPY --from=dotnet-build /app/plugins/devprint/lib ./plugins/devprint/lib

RUN chmod +x /app/plugins/devprint/lib/DevPrint.dll
# Gereksiz dosyaları kaldır
# RUN rm -rf archiveFiscal

# Backend uygulamasını başlat
CMD ["node", "server.js"]
