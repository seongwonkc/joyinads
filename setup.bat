@echo off
echo Setting up joyinads blog...

git init
git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod
git add .
git commit -m "initial blog setup"
git remote add origin https://github.com/seongwonkc/joyinads.git
git push -u origin main

echo.
echo Done! Now go to:
echo https://github.com/seongwonkc/joyinads/settings/pages
echo Set Source to: GitHub Actions
echo.
pause
