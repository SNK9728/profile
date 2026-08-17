Write-Host "Initializing Git and pushing to https://github.com/SNK9728/profile.git..." -ForegroundColor Cyan
git init
git add .
git commit -m "Deploy: Initial commit for modern monochrome personal portfolio"
git branch -M main
git remote add origin https://github.com/SNK9728/profile.git
git push -u origin main --force
Write-Host "Done! All files pushed to https://github.com/SNK9728/profile.git" -ForegroundColor Green
