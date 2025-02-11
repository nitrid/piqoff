#!/bin/bash

# .NET Core SDK kurulumunu kontrol et
if [ ! -d "/home/site/dotnet" ]; then
    echo "Installing .NET Core SDK..."
    mkdir -p /home/site/dotnet
    export DOTNET_INSTALL_DIR=/home/site/dotnet
    curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime dotnet --version 6.0.0
else
    echo ".NET Core SDK zaten kurulu, atliyorum..."
fi

# .NET Core SDK'yı PATH'e ekle
export DOTNET_ROOT=/home/site/dotnet
export PATH=$PATH:/home/site/dotnet

# Kalıcı font dizini
FONT_DIR="/home/site/fonts"
mkdir -p "$FONT_DIR"

# Microsoft Core Fonts kurulumunu kontrol et
if [ ! -f "$FONT_DIR/arial.ttf" ]; then
    echo "Microsoft Core Fonts kuruluyor..."
    
    # Gerekli paketleri kur
    apt-get update
    apt-get install -y wget cabextract

    # Geçici dizin oluştur
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"

    # Fontları indir ve kur
    FONTS="arial32.exe arialb32.exe comic32.exe courie32.exe georgi32.exe impact32.exe times32.exe trebuc32.exe verdan32.exe webdin32.exe"
    
    for font in $FONTS; do
        echo "Indiriliyor: $font"
        wget -q "https://downloads.sourceforge.net/project/corefonts/the%20fonts/final/$font"
        cabextract -q -d "$FONT_DIR" "$font"
    done

    # Sistem font dizinine sembolik bağlantı oluştur
    mkdir -p /usr/share/fonts/truetype/msttcorefonts
    ln -sf "$FONT_DIR"/*.ttf /usr/share/fonts/truetype/msttcorefonts/

    # Geçici dizini temizle
    rm -rf "$TEMP_DIR"

    # Font önbelleğini güncelle
    fc-cache -f -v
    
    echo "Microsoft Core Fonts kurulumu tamamlandi."
else
    echo "Microsoft Core Fonts zaten kurulu, atliyorum..."
    # Font dizinlerini kontrol et ve gerekirse bağlantıları yenile
    mkdir -p /usr/share/fonts/truetype/msttcorefonts
    ln -sf "$FONT_DIR"/*.ttf /usr/share/fonts/truetype/msttcorefonts/
    fc-cache -f -v
fi

# Node.js uygulamasını başlatmak için çalışma dizinini değiştir
cd /home/site/wwwroot

# Node.js uygulamasını başlat
echo "Starting Node.js application..."
npm start
