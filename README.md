# KP Manoj Tech Trends - Article Platform

A modern, performant blog platform for sharing insights on AI, technology trends, and business innovation.

## 🚀 Features

- ✅ Responsive, modern UI with dark mode support
- ✅ Featured and trending articles
- ✅ Article categorization and tagging
- ✅ Read time and view counter
- ✅ Email newsletter subscription
- ✅ About page with professional profile
- ✅ SEO optimized
- ✅ Fast static site generation
- ✅ Mobile-first design

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Deployment**: Netlify (Static Hosting)
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd article
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗 Build & Deploy

### Local Build
```bash
npm run build
```

This creates an optimized production build in the `out/` directory.

### Deploy to Netlify

#### Option 1: Using Netlify CLI (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize site:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

#### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Click "Deploy site"

#### Option 3: Drag & Drop

1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `out/` folder to deploy

## 📁 Project Structure

```
article/
├── app/
│   ├── layout.js          # Root layout with header/footer
│   ├── page.js            # Homepage
│   ├── globals.css        # Global styles
│   ├── articles/
│   │   ├── page.js        # Articles listing
│   │   └── [slug]/
│   │       └── page.js    # Individual article page
│   └── about/
│       └── page.js        # About page
├── components/
│   ├── Header.js          # Navigation header
│   ├── Footer.js          # Site footer
│   ├── Hero.js            # Homepage hero section
│   ├── FeaturedArticles.js
│   ├── ArticleCard.js     # Article preview card
│   ├── ArticleList.js     # Articles grid
│   ├── ArticleContent.js  # Full article display
│   ├── TrendingTopics.js  # Category showcase
│   └── Newsletter.js      # Email subscription
├── lib/
│   └── articles.js        # Article data & functions
├── public/                # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
├── FEATURES.md           # Feature documentation
├── BACKEND_SCALING.md    # Scaling guide
└── README.md
```

## 📝 Adding New Articles

Currently, articles are stored in `lib/articles.js`. To add a new article:

1. Open `lib/articles.js`
2. Add a new article object to the `articles` array:

```javascript
{
  slug: 'article-url-slug',
  title: 'Article Title',
  excerpt: 'Brief description of the article...',
  content: `Full article content in markdown format...`,
  category: 'Category Name',
  date: 'Nov 18, 2024',
  readTime: '5 min read',
  views: '1.2K',
  featured: false,
  tags: ['tag1', 'tag2', 'tag3'],
}
```

3. Rebuild the site to see changes

**Note**: For easier content management, see `BACKEND_SCALING.md` for CMS integration options.

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Content
- **Site Title**: Edit `app/layout.js` metadata
- **About Info**: Edit `app/about/page.js`
- **Social Links**: Update in `components/Header.js` and `components/Footer.js`

## 📊 Features Documentation

See [FEATURES.md](./FEATURES.md) for detailed feature documentation.

## 🚀 Scaling Backend

See [BACKEND_SCALING.md](./BACKEND_SCALING.md) for:
- When and how to add a backend
- CMS integration options
- Database and API implementation
- Newsletter automation
- Analytics setup
- Cost estimates for different scales

## 🔧 Configuration

### Environment Variables (for future backend integration)

Create a `.env.local` file:

```env
# Newsletter (e.g., SendGrid, Mailchimp API)
NEXT_PUBLIC_NEWSLETTER_API=your_api_key

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# CMS (e.g., Sanity, Contentful)
NEXT_PUBLIC_CMS_API=your_cms_api
```


## 📈 Analytics

### Option 1: Google Analytics
Add to `app/layout.js`:

```javascript
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

### Option 2: Netlify Analytics
- Built-in, $9/month
- Enable in Netlify dashboard

### Option 3: Plausible (Privacy-focused)
- Add script to layout
- No cookies, GDPR compliant

## 🐛 Troubleshooting

### Build fails on Netlify
- Ensure Node version is 18+ (set in `netlify.toml` or UI)
- Check build logs for specific errors
- Verify all dependencies are in `package.json`

### Images not loading
- Ensure images are in `public/` folder
- Check image paths in code
- Verify `next.config.js` has `images: { unoptimized: true }`

### Styles not applying
- Clear browser cache
- Run `npm run build` locally to test
- Check Tailwind configuration

## 🤝 Contributing

To update content:
1. Edit articles in `lib/articles.js`
2. Test locally with `npm run dev`
3. Deploy with `netlify deploy --prod`

## 📧 Contact

- **Email**: contact@kpmanoj.com
- **LinkedIn**: [Add your LinkedIn]
- **GitHub**: [Add your GitHub]
- **Twitter**: [Add your Twitter]

## 📄 License

This project is for personal use. Feel free to use as a template for your own blog.

---

## 🎯 Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Deploy
netlify deploy --prod    # Deploy to Netlify

# Maintenance
npm update          # Update dependencies
npm audit fix       # Fix security vulnerabilities
```

## 🔮 Roadmap

- [x] Initial static site
- [x] Responsive design
- [x] Newsletter signup
- [x] About page
- [ ] CMS integration (Sanity)
- [ ] Comments system
- [ ] Search functionality
- [ ] RSS feed
- [ ] Social sharing
- [ ] Reading progress bar

---

Built with ❤️ by KP Manoj | Powered by Next.js & Netlify

