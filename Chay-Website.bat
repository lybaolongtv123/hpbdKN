@echo off
setlocal
cd /d "%~dp0"
title Birthday Website - Local Server

echo ==============================================
echo   WEBSITE SINH NHAT - CHAY THU TREN MAY
echo ==============================================
echo.
echo   Dia chi : http://localhost:8080
echo   Tat     : nhan Ctrl + C trong cua so nay
echo.
echo   LUU Y: Dung mo truc tiep file index.html
echo   (trinh duyet se chan phan Gift 3D).
echo.
echo ==============================================
echo.

rem Mo trinh duyet sau 2 giay, cho server khoi dong xong
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:8080/'"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0_server.ps1"

echo.
echo Server da dung.
pause
