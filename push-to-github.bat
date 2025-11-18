@echo off
echo ========================================
echo Push KP Manoj Tech Trends to GitHub
echo ========================================
echo.

:INPUT
set /p GITHUB_USER="Enter your GitHub username: "
if "%GITHUB_USER%"=="" goto INPUT

set /p REPO_NAME="Enter repository name (press Enter for 'kpmanoj-techtrends'): "
if "%REPO_NAME%"=="" set REPO_NAME=kpmanoj-techtrends

echo.
echo ========================================
echo Configuration:
echo ========================================
echo GitHub Username: %GITHUB_USER%
echo Repository Name: %REPO_NAME%
echo Full URL: https://github.com/%GITHUB_USER%/%REPO_NAME%.git
echo.

set /p CONFIRM="Is this correct? (Y/N): "
if /i not "%CONFIRM%"=="Y" goto INPUT

echo.
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.

REM Remove any existing remote (in case)
git remote remove origin 2>nul

REM Add GitHub remote
echo Adding remote...
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

REM Ensure we're on main branch
echo Switching to main branch...
git branch -M main

REM Push to GitHub
echo Pushing code...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Push failed!
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub yet
    echo 2. Wrong username or repository name
    echo 3. Need to authenticate with GitHub
    echo.
    echo Please:
    echo 1. Make sure you created the repository on GitHub
    echo 2. Check your username and repository name
    echo 3. Try running this script again
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub!
echo ========================================
echo.
echo Your repository: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
echo Next steps:
echo 1. Visit your GitHub repository to verify
echo 2. Go to Netlify dashboard to connect GitHub
echo 3. Enable automatic deployments!
echo.
pause

