# Deployment Guide - KP Manoj Tech Trends

This guide will help you deploy your article platform to Netlify for free hosting.

## Prerequisites

- Node.js 18+ installed
- npm installed
- Git installed (optional but recommended)
- Netlify account (free) - Sign up at https://netlify.com

## Deployment Options

### Option 1: Netlify CLI (Recommended - Fastest)

This method allows you to deploy directly from your local machine.

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate with Netlify.

#### Step 3: Build Your Site

```bash
cd "C:\Users\manojkp\OneDrive - Synopsys, Inc\Documents\New Tasks\Core Team Projects\VMRequestCore\git-deploy\nex-gen\Agentic AI\apps\article"

npm install
npm run build
```

#### Step 4: Deploy

For the first deployment:

```bash
netlify deploy
```

Follow the prompts:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: Choose a name (e.g., kpmanoj-tech-trends)
- **Publish directory**: `out`

Review the draft URL provided.

#### Step 5: Deploy to Production

Once you verify the draft looks good:

```bash
netlify deploy --prod
```

Your site is now live! 🎉

The CLI will show you:
- Website URL: `https://your-site-name.netlify.app`
- Admin URL: Netlify dashboard link

---

### Option 2: Git-Based Deployment (Best for Continuous Deployment)

This method automatically deploys when you push to Git.

#### Step 1: Push to Git Repository

If not already done:

```bash
cd "C:\Users\manojkp\OneDrive - Synopsys, Inc\Documents\New Tasks\Core Team Projects\VMRequestCore\git-deploy\nex-gen\Agentic AI\apps\article"

git init
git add .
git commit -m "Initial commit - KP Manoj Tech Trends"
```

Create a repository on GitHub/GitLab/Bitbucket and push:

```bash
git remote add origin <your-repository-url>
git push -u origin main
```

#### Step 2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your article repository

#### Step 3: Configure Build Settings

Netlify should auto-detect Next.js, but verify:

- **Branch to deploy**: `main` (or your default branch)
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18 (should be automatic with .nvmrc file)

#### Step 4: Deploy

Click **"Deploy site"**

Netlify will:
1. Clone your repository
2. Install dependencies
3. Build your site
4. Deploy to CDN

This takes 2-3 minutes for the first deployment.

#### Future Updates

Any time you push to your main branch, Netlify will automatically rebuild and redeploy your site.

```bash
git add .
git commit -m "Add new article"
git push
```

---

### Option 3: Drag & Drop (Simplest - No CLI/Git needed)

Perfect for quick testing.

#### Step 1: Build Locally

```bash
cd "C:\Users\manojkp\OneDrive - Synopsys, Inc\Documents\New Tasks\Core Team Projects\VMRequestCore\git-deploy\nex-gen\Agentic AI\apps\article"

npm install
npm run build
```

This creates an `out/` folder with your static site.

#### Step 2: Deploy

1. Go to https://app.netlify.com/drop
2. Drag the `out` folder onto the drop zone
3. Wait for upload and deployment

Your site is live!

**Note**: This method requires manual redeployment for updates.

---

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

#### Using a domain you own:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `techtrends-kpmanoj.com`)
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

#### Using Netlify subdomain:

1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to your preferred subdomain (e.g., `kpmanoj-techtrends`)

Your site will be: `https://kpmanoj-techtrends.netlify.app`

### 2. Enable Form Submissions (For Newsletter)

Netlify can handle form submissions for free:

1. Go to **Site settings** → **Forms**
2. Enable form detection
3. Set up email notifications
4. (Optional) Integrate with Zapier for advanced workflows

### 3. Set Up Analytics (Optional)

#### Netlify Analytics ($9/month):
- Go to **Site settings** → **Analytics**
- Click **"Enable analytics"**

#### Google Analytics (Free):
- Already configured in the code
- Just add your GA4 tracking ID as environment variable

### 4. Environment Variables

If you add backend features later:

1. Go to **Site settings** → **Environment variables**
2. Add your variables (e.g., API keys)
3. Redeploy for changes to take effect

---

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] All articles are accessible
- [ ] About page displays properly
- [ ] Newsletter signup form works
- [ ] Navigation menu functions on mobile
- [ ] Images load (if any added later)
- [ ] Dark mode toggle works
- [ ] Links are not broken
- [ ] Site is responsive on mobile
- [ ] Performance is good (test with PageSpeed Insights)

---

## Updating Your Site

### If using CLI:

```bash
# Make changes to your code
npm run build
netlify deploy --prod
```

### If using Git integration:

```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push
# Netlify automatically rebuilds and deploys
```

### Adding New Articles:

1. Edit `lib/articles.js`
2. Add your new article object
3. Test locally: `npm run dev`
4. Deploy using your chosen method

---

## Troubleshooting

### Build fails with "command not found: npm"

**Solution**: Ensure Node.js 18+ is specified:
- Check `.nvmrc` file exists with content: `18`
- Or add to `netlify.toml`: `NODE_VERSION = "18"`

### Pages show 404 errors

**Solution**: Verify `netlify.toml` has correct redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Styles not loading

**Solution**: 
1. Check that `npm run build` completes without errors locally
2. Verify Tailwind CSS is properly configured
3. Clear Netlify cache: **Site settings** → **Build & deploy** → **Clear cache and retry deploy**

### Images not appearing

**Solution**: 
- Ensure images are in `public/` folder
- Check `next.config.js` has `images: { unoptimized: true }`

### Slow build times

**Solution**:
- Netlify builds should take 1-3 minutes
- If slower, check for large dependencies
- Consider using Netlify's build cache

---

## Performance Optimization

### Enable Caching

Already configured in `netlify.toml`:
```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Enable Gzip Compression

Automatic on Netlify - no configuration needed.

### Optimize Images

For future images:
1. Use WebP format when possible
2. Compress images before uploading
3. Consider using Cloudinary or similar CDN

### Monitor Performance

Use these tools:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- Netlify Analytics (built-in)

---

## Cost Breakdown

### Free Tier (Current Setup)
- **Hosting**: Free
- **Bandwidth**: 100GB/month
- **Build minutes**: 300/month
- **Sites**: Unlimited
- **SSL**: Free (automatic)
- **Forms**: 100 submissions/month

### When to Upgrade
Upgrade to Pro ($19/month) when you need:
- More bandwidth (>100GB/month)
- More build minutes
- Advanced analytics
- Role-based access control
- Priority support

---

## Security Features (Already Configured)

✅ Automatic HTTPS/SSL  
✅ DDoS protection  
✅ Security headers configured  
✅ Automatic security updates  
✅ CDN protection  

---

## Getting Help

### Netlify Documentation
- https://docs.netlify.com

### Support
- Community Forum: https://answers.netlify.com
- Status Page: https://www.netlifystatus.com
- Support: support@netlify.com (Pro plans)

### Next.js Documentation
- https://nextjs.org/docs

---

## Quick Reference

### Useful Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy draft to Netlify
netlify deploy

# Deploy to production
netlify deploy --prod

# Open Netlify dashboard
netlify open

# Check deployment status
netlify status

# View logs
netlify logs
```

### Important URLs
- Netlify Dashboard: https://app.netlify.com
- Your Site: https://[your-site-name].netlify.app
- Site Settings: https://app.netlify.com/sites/[your-site-name]/settings

---

## Next Steps

After successful deployment:

1. ✅ Share your site URL!
2. ✅ Configure custom domain (optional)
3. ✅ Set up analytics
4. ✅ Add new articles regularly
5. ✅ Monitor performance
6. ✅ Collect newsletter subscribers
7. ✅ Consider backend integration (see BACKEND_SCALING.md)

---

**Congratulations! Your article platform is now live! 🚀**

Your site is deployed with:
- ⚡ Lightning-fast performance
- 🌍 Global CDN
- 🔒 Automatic HTTPS
- 📱 Fully responsive
- ♿ Accessible
- 🎨 Beautiful design

Time to share your knowledge with the world!

---

**Need Help?** Contact: contact@kpmanoj.com

