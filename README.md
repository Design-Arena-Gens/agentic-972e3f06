# Instagram Auto Poster

A Next.js application for scheduling and automatically posting content to Instagram.

## Features

- 📝 Create posts with images and captions
- ⏰ Schedule posts for future delivery
- 🚀 Automatic posting at scheduled times
- 📊 Track post status (pending, posted, failed)
- 🎨 Modern, responsive UI with Tailwind CSS

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## How It Works

1. **Upload Image**: Select an image file for your Instagram post
2. **Write Caption**: Add your caption with hashtags
3. **Schedule Time**: Choose when you want the post to go live
4. **Auto-Post**: The system checks every 5 seconds and posts when the scheduled time arrives

## Note

This is a demonstration application. In a production environment, you would:

- Connect to Instagram Graph API (for Business accounts)
- Implement proper authentication and authorization
- Use a database instead of file storage
- Set up background jobs for scheduled posting
- Add error handling and retry logic
- Implement rate limiting and API quotas

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- File-based storage (demo purposes)

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```
