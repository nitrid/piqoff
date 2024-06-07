#!/bin/bash

# .NET Core SDK'yı belirli bir dizine kur
echo "Installing .NET Core SDK..."
mkdir -p /home/site/dotnet
export DOTNET_INSTALL_DIR=/home/site/dotnet
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime dotnet --version 6.0.0

# .NET Core SDK'yı PATH'e ekle
export DOTNET_ROOT=/home/site/dotnet
export PATH=$PATH:/home/site/dotnet

# Node.js uygulamasını başlat
echo "Starting Node.js application..."
npm start
