@echo off
echo ========================================
echo KP Manoj Tech Trends - Netlify Deploy
echo ========================================
echo.

REM Check if already built
if not exist "out\" (
    echo Building the application...
    call npm run build
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
)

echo.
echo Build successful!
echo.
echo ========================================
echo DEPLOYMENT OPTIONS:
echo ========================================
echo.
echo Option 1: Netlify CLI (Recommended)
echo ---------------------------------
echo 1. Login to Netlify:
echo    netlify login
echo.
echo 2. Deploy (first time):
echo    netlify deploy
echo    - Choose "Create & configure a new site"
echo    - Publish directory: out
echo.
echo 3. Deploy to production:
echo    netlify deploy --prod
echo.
echo.
echo Option 2: Drag & Drop (Easiest)
echo ---------------------------------
echo 1. Go to: https://app.netlify.com/drop
echo 2. Drag the "out" folder onto the page
echo 3. Your site will be live instantly!
echo.
echo.
echo Option 3: Git Integration
echo ---------------------------------
echo 1. Push code to GitHub/GitLab/Bitbucket
echo 2. Connect repository on Netlify dashboard
echo 3. Automatic deployments on every push
echo.
echo ========================================

pause

