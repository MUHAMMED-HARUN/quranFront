@echo off

REM ===============================
REM إعداد مسار المشروع
REM ===============================
cd /d "%~dp0"

echo Removing temporary build files...
for /d %%d in (bin obj) do (
    if exist %%d (
        git rm -r --cached %%d
    )
)

echo Adding files...
git add .

set /p commitMessage="Enter commit message: "
if "%commitMessage%"=="" set commitMessage=Update
git commit -m "%commitMessage%"

git fetch origin
git merge origin/main
git push origin main

echo Done.
pause
