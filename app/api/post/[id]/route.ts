import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts')

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const postPath = path.join(POSTS_DIR, `${postId}.json`)

    if (!existsSync(postPath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const content = await readFile(postPath, 'utf-8')
    const post = JSON.parse(content)

    // Simulate instant posting
    post.status = 'posted'
    post.postedAt = new Date().toISOString()

    await writeFile(postPath, JSON.stringify(post, null, 2))

    return NextResponse.json({
      message: 'Post published successfully',
      post
    })
  } catch (error) {
    console.error('Error posting:', error)
    return NextResponse.json(
      { error: 'Failed to post' },
      { status: 500 }
    )
  }
}
