import { NextResponse } from 'next/server'
import { readdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts')

export async function GET() {
  try {
    if (!existsSync(POSTS_DIR)) {
      return NextResponse.json({ posts: [] })
    }

    const files = await readdir(POSTS_DIR)
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await readFile(path.join(POSTS_DIR, file), 'utf-8')
          const post = JSON.parse(content)

          // Check if it's time to post
          const now = new Date()
          const scheduledTime = new Date(post.scheduledTime)

          if (post.status === 'pending' && scheduledTime <= now) {
            // Simulate posting
            post.status = 'posted'
            await writeFile(
              path.join(POSTS_DIR, file),
              JSON.stringify(post, null, 2)
            )
          }

          return post
        })
    )

    // Sort by scheduled time (newest first)
    posts.sort((a, b) =>
      new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
    )

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error loading posts:', error)
    return NextResponse.json({ posts: [] })
  }
}
