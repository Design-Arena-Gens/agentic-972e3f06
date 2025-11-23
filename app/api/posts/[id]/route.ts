import { NextRequest, NextResponse } from 'next/server'
import { unlink, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function DELETE(
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

    // Delete image
    const imagePath = path.join(process.cwd(), 'public', post.imageUrl)
    if (existsSync(imagePath)) {
      await unlink(imagePath)
    }

    // Delete post data
    await unlink(postPath)

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
