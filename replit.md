# R4 Academy - AI Studio App

## Overview
R4 Academy is a React-based AI application powered by Google Gemini. It provides various AI agents including chat, image analysis, image generation, video generation, and prompt specialist capabilities.

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini API (@google/genai)
- **Styling**: TailwindCSS (via CDN)

### Project Structure
- `/components/` - React components
  - `/agents/` - AI agent components (Chat, Image Analysis, Image Generation, etc.)
  - Various UI components (Header, Sidebar, Modals, etc.)
- `App.tsx` - Main application component
- `index.tsx` - Application entry point
- `vite.config.ts` - Vite configuration
- `types.ts` - TypeScript type definitions

### Key Features
- Multiple AI agent interfaces
- Community view for content sharing
- Admin view for management
- Video player and editing capabilities
- Chat history sidebar

## Configuration

### Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (configured in Replit Secrets)
- `CAKTO_PRODUCT_ID` - ID do produto Cakto para assinaturas (opcional)
- `CAKTO_WEBHOOK_SECRET` - Segredo compartilhado para validar webhooks do Cakto
- `VITE_API_URL` - URL base da API (opcional, padrão: `/api` com proxy)

### Server Configuration
- **Port**: 5000 (required for Replit frontend)
- **Host**: 0.0.0.0 (allows Replit proxy access)
- **HMR**: Configured for Replit's iframe proxy environment

## Development

### Running Locally
The app runs on port 5000 with hot module replacement enabled.

### Build Command
```bash
npm run build
```

### Development Command
```bash
npm run dev
```

## Recent Changes
- **2025-11-06**: Full platform implementation and bug fixes
  - Backend API with Express, JWT authentication, SQLite database
  - Complete database schema (users, subscriptions, courses, lessons, progress, chat history)
  - Cakto payment integration with secure webhook verification
  - Frontend authentication system with React Context
  - Login/Signup UI components
  - Subscription paywall for AI agents
  - Backend and frontend workflows running on ports 3000 and 5000
  - Vite proxy configuration connecting frontend to backend
  - Email-based admin role assignment (includes teste@gmail.com)
  - Security: JWT tokens, bcrypt passwords, webhook signature verification
  - Configured Vite to use port 5000 for Replit compatibility
  - Added `allowedHosts: true` to fix Replit proxy blocking
  - Fixed AgentView black screen by adding state management (history, chatHistories, handlers)
  - Fixed VideoPlayerView black screen by correcting prop name (video → initialVideo)
  - Implemented comments functionality in CommunityView with full UI and state management
  - Added OpenAI integration with GPT-4o chat agent
  - Implemented video progress persistence using localStorage
  - Now features dual AI chat: Google Gemini and OpenAI GPT

## Notes
- This app was imported from AI Studio (https://ai.studio/apps/drive/16b5ElGbSprtdan1jbs4RNGAE78kxil0q)
- The app uses TailwindCSS loaded from CDN
- Custom animations and styling defined in index.html
