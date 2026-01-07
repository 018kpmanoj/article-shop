# PowerShell script to push to GitHub
# Run this script manually to push your commits

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub - Article App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show current commits to push
Write-Host "Commits to push:" -ForegroundColor Yellow
git log origin/main..HEAD --oneline
Write-Host ""

# Check if there are commits to push
$commitCount = (git rev-list --count origin/main..HEAD)
if ($commitCount -eq 0) {
    Write-Host "No commits to push!" -ForegroundColor Green
    exit 0
}

Write-Host "Found $commitCount commit(s) to push" -ForegroundColor Green
Write-Host ""

# Push to origin
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/018kpmanoj/article-shop" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Update your GitHub token in the remote URL" -ForegroundColor Yellow
    Write-Host "2. Or run: git push origin main manually" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To update the token, run:" -ForegroundColor Yellow
    Write-Host 'git remote set-url origin https://YOUR_NEW_TOKEN@github.com/018kpmanoj/article-shop.git' -ForegroundColor White
}
