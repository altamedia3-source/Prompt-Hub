# PromptHub AI

A modern fullstack web application for discovering, creating, and managing AI prompts.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend API**: Express.js (Node.js)
- **Database & Auth**: Supabase (PostgreSQL)

## Deployment Guide

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the SQL Editor and run the contents of `supabase-schema.sql` to create the `prompts` table and set up Row Level Security (RLS).
3. Go to Project Settings -> API and copy your `URL` and `anon` public key.

### 2. Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`) and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deploying to Vercel (Frontend) & Render (Backend)
This repository is structured to run as a single full-stack app, but can easily be split:
- **Vercel**: Set the build command to `npm run build` and output directory to `dist`.
- **Render**: Create a Web Service, set build command to `npm install && npm run build`, and start command to `npm start`.

*Note: In the AI Studio environment, the app runs as a unified Express + Vite application.*
