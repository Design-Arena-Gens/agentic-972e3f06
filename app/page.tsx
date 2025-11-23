'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

interface ScheduledPost {
  id: string
  caption: string
  imageUrl: string
  scheduledTime: string
  status: 'pending' | 'posted' | 'failed'
  createdAt: string
}

export default function Home() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [caption, setCaption] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPosts()
    const interval = setInterval(loadPosts, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadPosts = async () => {
    try {
      const response = await axios.get('/api/posts')
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSchedulePost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile || !caption || !scheduledTime) {
      setMessage('Please fill in all fields')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('caption', caption)
      formData.append('scheduledTime', scheduledTime)

      const response = await axios.post('/api/schedule', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setMessage(response.data.message || 'Post scheduled successfully!')
      setCaption('')
      setImageFile(null)
      setImagePreview('')
      setScheduledTime('')
      loadPosts()
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to schedule post')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`/api/posts/${postId}`)
      setMessage('Post deleted successfully')
      loadPosts()
    } catch (error) {
      setMessage('Failed to delete post')
    }
  }

  const handlePostNow = async (postId: string) => {
    try {
      await axios.post(`/api/post/${postId}`)
      setMessage('Posting now...')
      loadPosts()
    } catch (error) {
      setMessage('Failed to post')
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📸 Instagram Auto Poster
          </h1>
          <p className="text-gray-600">Schedule and automatically post to Instagram</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Schedule Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Schedule New Post</h2>

            <form onSubmit={handleSchedulePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Write your caption here... #hashtags"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Scheduling...' : 'Schedule Post'}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${message.includes('success') || message.includes('scheduled') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">How It Works</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <h3 className="font-semibold text-gray-800">1. Create Your Post</h3>
                  <p className="text-sm">Upload an image and write your caption with hashtags</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">⏰</span>
                <div>
                  <h3 className="font-semibold text-gray-800">2. Schedule Time</h3>
                  <p className="text-sm">Choose when you want your post to go live</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚀</span>
                <div>
                  <h3 className="font-semibold text-gray-800">3. Auto-Post</h3>
                  <p className="text-sm">The system automatically posts at the scheduled time</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-800">4. Track Status</h3>
                  <p className="text-sm">Monitor your scheduled and posted content below</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a demo application. In production, you would connect your Instagram account via the Instagram Graph API or use official business tools.
              </p>
            </div>
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Scheduled Posts</h2>

          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No scheduled posts yet. Create your first one above!</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt="Post preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{post.caption}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      📅 {format(new Date(post.scheduledTime), 'MMM d, yyyy h:mm a')}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'posted' ? 'bg-green-100 text-green-800' :
                        post.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {post.status === 'pending' && (
                        <button
                          onClick={() => handlePostNow(post.id)}
                          className="flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700"
                        >
                          Post Now
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex-1 bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
