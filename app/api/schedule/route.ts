import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from '@/lib/uuid'

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads')

async function ensureDirectories() {
  if (!existsSync(POSTS_DIR)) {
    await mkdir(POSTS_DIR, { recursive: true })
  }
  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirectories()

    const formData = await request.formData()
    const image = formData.get('image') as File
    const caption = formData.get('caption') as string
    const scheduledTime = formData.get('scheduledTime') as string

    if (!image || !caption || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const postId = uuidv4()
    const imageExtension = image.name.split('.').pop()
    const imageFileName = `${postId}.${imageExtension}`
    const imageBuffer = Buffer.from(await image.arrayBuffer())

    await writeFile(path.join(IMAGES_DIR, imageFileName), imageBuffer)

    const post = {
      id: postId,
      caption,
      imageUrl: `/uploads/${imageFileName}`,
      scheduledTime,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    await writeFile(
      path.join(POSTS_DIR, `${postId}.json`),
      JSON.stringify(post, null, 2)
    )

    return NextResponse.json({
      message: 'Post scheduled successfully',
      post
    })
  } catch (error) {
    console.error('Error scheduling post:', error)
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    )
  }
}
