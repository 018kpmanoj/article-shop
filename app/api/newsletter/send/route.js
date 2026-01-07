import { NextResponse } from 'next/server';

// Hardcoded articles for newsletter - prevents import issues
const getLatestArticles = () => {
  return [
    {
      title: "How AI Agents Are Revolutionizing Business Automation",
      slug: "ai-agents-revolutionizing-business-automation",
      excerpt: "Discover how autonomous AI agents are transforming business processes and what it means for the future of work.",
      category: "AI",
      readTime: "8 min read"
    },
    {
      title: "Building Scalable RAG Systems with Vector Databases",
      slug: "building-scalable-rag-systems",
      excerpt: "A comprehensive guide to building production-ready Retrieval Augmented Generation systems.",
      category: "AI",
      readTime: "12 min read"
    },
    {
      title: "The Rise of Multi-Modal AI Models",
      slug: "rise-of-multi-modal-ai",
      excerpt: "Exploring how models that understand text, images, and audio are changing AI capabilities.",
      category: "AI",
      readTime: "10 min read"
    },
    {
      title: "Enterprise Scale Agentic AI Architecture",
      slug: "enterprise-scale-agentic-ai",
      excerpt: "Learn how to build enterprise-grade AI agent systems that scale reliably.",
      category: "Enterprise",
      readTime: "15 min read"
    },
    {
      title: "Multi-Agent Orchestration Patterns",
      slug: "multi-agent-orchestration",
      excerpt: "Best practices for coordinating multiple AI agents in complex workflows.",
      category: "AI",
      readTime: "11 min read"
    }
  ];
};

// Generate HTML email content
const generateEmailHTML = (articles, subscriberEmail) => {
  const articlesList = (articles || []).map(article => `
    <div style="margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 12px; border-left: 4px solid #3b82f6;">
      <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">
        <a href="https://kpmtechworld.netlify.app/articles/${article.slug}" style="color: #3b82f6; text-decoration: none;">
          ${article.title}
        </a>
      </h3>
      <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px; line-height: 1.6;">
        ${article.excerpt}
      </p>
      <div style="font-size: 12px; color: #94a3b8;">
        <span style="background: #e0e7ff; color: #4f46e5; padding: 2px 8px; border-radius: 4px; margin-right: 8px;">${article.category}</span>
        <span>📖 ${article.readTime}</span>
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px;">🚀 K P Manoj Tech Trends</h1>
      <p style="color: #e0e7ff; margin: 0; font-size: 16px;">Your Weekly AI & Technology Insights</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <h2 style="color: #1e293b; margin: 0 0 25px 0; font-size: 22px;">
        📬 This Week's Highlights
      </h2>
      
      ${articlesList}
      
      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://kpmtechworld.netlify.app/articles" 
           style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          View All Articles →
        </a>
      </div>
    </div>
    
    <!-- Divider -->
    <div style="border-top: 1px solid #e2e8f0; margin: 0 30px;"></div>
    
    <!-- Footer -->
    <div style="padding: 25px 30px; background: #f8fafc; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
        You're receiving this because you subscribed to K P Manoj Tech Trends.
      </p>
      <p style="margin: 0; font-size: 13px;">
        <a href="https://kpmtechworld.netlify.app" style="color: #3b82f6; text-decoration: none;">Visit Website</a>
        &nbsp;•&nbsp;
        <a href="mailto:018kpmanoj@gmail.com" style="color: #3b82f6; text-decoration: none;">Contact</a>
      </p>
    </div>
  </div>
  
  <!-- Bottom spacing -->
  <div style="padding: 20px; text-align: center;">
    <p style="color: #94a3b8; font-size: 11px; margin: 0;">
      © 2026 K P Manoj Tech Trends. All rights reserved.
    </p>
  </div>
</body>
</html>
  `;
};

// Send email using Resend API
const sendEmailViaResend = async (to, subject, htmlContent) => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'Resend API key not configured. Add RESEND_API_KEY to environment.' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'K P Manoj Tech <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: htmlContent,
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, id: data.id };
    } else {
      return { success: false, error: data.message || 'Failed to send email' };
    }
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, error: error.message };
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email } = body;
    
    // Get articles safely
    const articles = getLatestArticles();
    
    if (action === 'send_test') {
      const testEmail = email || '018kpmanoj@gmail.com';
      const subject = '🧪 TEST: Weekly Tech Trends from K P Manoj';
      const html = generateEmailHTML(articles, testEmail);
      
      const result = await sendEmailViaResend(testEmail, subject, html);
      
      return NextResponse.json({
        success: result.success,
        message: result.success ? `Test email sent to ${testEmail}` : result.error
      });
    }
    
    if (action === 'send_all') {
      return NextResponse.json({
        success: false,
        message: 'Bulk sending requires admin authentication via admin panel.'
      });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid action' });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to preview newsletter
export async function GET() {
  const articles = getLatestArticles();
  const html = generateEmailHTML(articles, 'preview@example.com');
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
