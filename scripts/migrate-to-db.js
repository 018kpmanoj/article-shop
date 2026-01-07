const { createClient } = require('@supabase/supabase-js')
const { allArticles } = require('../data/index')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateArticles() {
  console.log(`🚀 Starting migration of ${allArticles.length} articles to Supabase...`)
  console.log('')
  
  let successCount = 0
  let errorCount = 0
  
  for (const article of allArticles) {
    try {
      const { error } = await supabase
        .from('articles')
        .upsert({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          date: article.date,
          read_time: article.readTime,
          views: article.views || '1.0K',
          featured: article.featured || false,
          tags: article.tags || [],
          published: true,
        }, {
          onConflict: 'slug'
        })
      
      if (error) {
        console.error(`❌ Error migrating "${article.title}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Migrated: ${article.title}`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception migrating "${article.title}":`, err.message)
      errorCount++
    }
  }
  
  console.log('')
  console.log('═'.repeat(60))
  console.log(`✅ Successfully migrated: ${successCount} articles`)
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} articles`)
  }
  console.log('═'.repeat(60))
  console.log('')
  console.log('🎉 Migration complete!')
  console.log('')
  console.log('Next steps:')
  console.log('1. Check your articles in Supabase dashboard')
  console.log('2. Update lib/articles.js to fetch from database')
  console.log('3. Redeploy your site')
}

migrateArticles().catch(console.error)

