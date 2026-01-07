import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
  readTime: text('read_time').notNull(),
  views: text('views').default('1.0K'),
  featured: boolean('featured').default(false),
  tags: text('tags').array(),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

