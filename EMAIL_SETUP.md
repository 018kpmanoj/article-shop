# Email Newsletter Setup Guide

## Quick Setup with Resend (Recommended - Free Tier: 100 emails/day)

### Step 1: Create Resend Account
1. Go to https://resend.com/signup
2. Sign up with your email
3. Verify your email

### Step 2: Get API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "KPMTech Newsletter"
4. Copy the API key

### Step 3: Add to Netlify Environment Variables
1. Go to https://app.netlify.com/sites/kpmtechworld/settings/env
2. Add: `RESEND_API_KEY` = your_resend_api_key

### Step 4: Add Domain (Optional but recommended for production)
1. Go to https://resend.com/domains
2. Add your domain for better deliverability

---

## Alternative: EmailJS Setup (Client-side, simpler)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for free (200 emails/month)

### Step 2: Create Email Service
1. Go to Email Services > Add New Service
2. Choose Gmail/Outlook
3. Connect your email account

### Step 3: Create Email Template
1. Go to Email Templates > Create New Template
2. Use this template:

```
Subject: {{subject}}
To: {{to_email}}
From: K P Manoj Tech Trends

{{{message_html}}}
```

### Step 4: Get Credentials
1. Go to Account > General
2. Copy your Public Key
3. Copy Service ID from Email Services
4. Copy Template ID from Email Templates

### Step 5: Add to Netlify
Add these environment variables:
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

---

## Testing Newsletter

1. Go to http://localhost:3001 (or your deployed site)
2. Subscribe with your email in the newsletter section
3. Login as admin (018kpmanoj@gmail.com)
4. Go to Admin Dashboard > Newsletter tab
5. Click "Send Test Email" to verify setup

## Weekly Newsletter Schedule

The newsletter is designed to be sent every Sunday. For automated sending:

### Option 1: Netlify Scheduled Functions (Enterprise)
Add to netlify.toml:
```toml
[functions."scheduled-newsletter"]
  schedule = "0 9 * * 0"  # Every Sunday at 9 AM UTC
```

### Option 2: GitHub Actions (Free)
Create `.github/workflows/newsletter.yml`:
```yaml
name: Weekly Newsletter
on:
  schedule:
    - cron: '0 9 * * 0'  # Every Sunday 9 AM UTC
jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - name: Send Newsletter
        run: |
          curl -X POST https://kpmtechworld.netlify.app/api/newsletter/send \
            -H "Content-Type: application/json" \
            -d '{"action": "send_all"}'
```

### Option 3: Manual (Admin Panel)
Go to Admin Dashboard > Newsletter > Click "Send to All"
