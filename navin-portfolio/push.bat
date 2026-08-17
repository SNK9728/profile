@echo off
echo ========================================================
echo   Pushing Portfolio to GitHub (https://github.com/SNK9728/profile.git)
echo ========================================================
cd /d "%~dp0"
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo Process complete. Press any key to exit.
pause
