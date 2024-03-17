@echo off
SET repoDir=C:\tst
echo Cloning the Piqoff repository into %repoDir%...
IF NOT EXIST "%repoDir%" mkdir "%repoDir%"
cd /d "%repoDir%"
git clone https://github.com/nitrid/piqoff .
echo Installing dependencies for Piqoff...
npm install
cd www
echo Installing dependencies for the frontend...
npm install
cd setup
echo Running setup script...
node init.js