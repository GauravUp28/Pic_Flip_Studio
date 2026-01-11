# PicFlip Studio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)

**PicFlip Studio** is a cloud-native image processing suite that automates background removal and aesthetic mirroring. Built with a focus on clean architecture and type safety, it provides a seamless REST API for transforming assets and a modern dashboard for managing your creative gallery.

Live Link: https://pic-flip-studio.vercel.app

Live Demo Video: https://drive.google.com/file/d/19F60sssl2wFoXtVOsaHmun8lPA8kUCbd/view?usp=sharing

## ✨ Features

- **Smart Isolation**: Instantly removes complex backgrounds using AI (via Remove.bg).
- **Creative Flip Control**: Choose between Horizontal, Vertical, Both, or No flip modes to achieve the perfect composition.
- **Cloud Vault**: Securely stores optimized assets using Supabase Storage.
- **Modern UI**: A responsive, drag-and-drop interface built with React and Tailwind.
- **Type-Safe**: End-to-end type safety from database to frontend.

## 🛠 Tech Stack

**Core API (Backend)**
- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Storage**: Supabase (PostgreSQL + S3-compatible storage)
- **Processing**: Sharp & Axios

**Client (Frontend)**
- **Framework**: Vite + React
- **Styling**: Tailwind CSS
- **State**: React Hooks

## Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase account
- Remove.bg API key

### 1. Cloud Infrastructure Setup

1. **Supabase**
   - Create a new project: [supabase.com](https://supabase.com)
   - Create a **public** storage bucket named `processed-images`
   - Run the provided schema in `backend/database/init.sql`.
   - Retrieve your **Project URL** and **Service Role Key** (Settings > API)

2. **Backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend root:
   ```env
   PORT=3001
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key
   REMOVE_BG_API_KEY=your_remove_bg_key
   FRONTEND_URL=http://localhost:5173
   ```

   Start the API service
   ```bash
   npm run start:dev
   ```
   
   The service will launch at `http://localhost:3001`


3. **Frontend**
   ```bash
   cd frontend
   npm install
   ```
   
   Create a `.env` file in the frontend root:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

   Launch the interface:
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173` to access the studio.


## API Endpoints

- `POST /api/images/upload` - Upload and process image
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get image by ID
- `DELETE /api/images/:id` - Delete image

## Project Structure

```
backend/src/
  ├── api/images.ts
  ├── config/
  |   ├── supabase.ts
  ├── core/
  │   ├── database.ts
  │   ├── bucket.ts
  │   └── transformer.ts
  └── main.ts

frontend/src/
  ├── components/
  │   ├── ImageUpload.tsx
  │   ├── ImageList.tsx
  │   └── ImageDisplay.tsx
  ├── services/api.ts
  └── App.tsx
```

## 🌍 Deployment

### Backend (Render/Railway)
1. Push code to GitHub.
2. Connect repository to Render as a Web Service.
3. Set "Build Command" to npm install && npm run build.
4. Set "Start Command" to node dist/main.js.
5. Add environment variables defined above.

### Frontend (Vercel/Netlify)
1. Import repository to Vercel.
2. Set VITE_API_URL to your live backend URL (e.g., https://api.flipcut.com).
3. Deploy.

Built with ❤️ by [Gaurav Upadhyay](https://github.com/GauravUp28) and [Akanksha Achukola](https://github.com/achukola)
