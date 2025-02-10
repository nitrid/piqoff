@echo off
sc stop piqsoft.exe
timeout /t 5 /nobreak
sc start piqsoft.exe 