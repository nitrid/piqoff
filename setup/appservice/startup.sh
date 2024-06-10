#!/bin/bash

# .NET Core SDK'yı belirli bir dizine kur
echo "Installing .NET Core SDK..."
mkdir -p /home/site/dotnet
export DOTNET_INSTALL_DIR=/home/site/dotnet
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime dotnet --version 6.0.0

# .NET Core SDK'yı PATH'e ekle
export DOTNET_ROOT=/home/site/dotnet
export PATH=$PATH:/home/site/dotnet

# Microsoft Core Fonts'u yükle
echo "Installing Microsoft Core Fonts..."
apt-get update
apt-get install -y wget cabextract fontconfig

# Geçici dizine geç ve fontları indir
cd /tmp
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/arial32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/arialb32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/comic32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/courie32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/georgi32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/impact32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/times32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/trebuc32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/verdan32.exe
wget https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/webdin32.exe

# Fontlar için bir dizin oluştur ve fontları bu dizine çıkar
mkdir -p /usr/share/fonts/truetype/msttcorefonts
cd /usr/share/fonts/truetype/msttcorefonts
cabextract /tmp/arial32.exe
cabextract /tmp/arialb32.exe
cabextract /tmp/comic32.exe
cabextract /tmp/courie32.exe
cabextract /tmp/georgi32.exe
cabextract /tmp/impact32.exe
cabextract /tmp/times32.exe
cabextract /tmp/trebuc32.exe
cabextract /tmp/verdan32.exe
cabextract /tmp/webdin32.exe

# Font önbelleğini güncelle
fc-cache -f -v

# Node.js uygulamasını başlatmak için çalışma dizinini değiştir
cd /home/site/wwwroot

# Node.js uygulamasını başlat
echo "Starting Node.js application..."
npm start
