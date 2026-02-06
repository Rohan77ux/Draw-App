# 🎨 Draw App — Real-Time Collaborative Whiteboard

A powerful, modern real-time collaboration drawing system built using Next.js, WebSockets, Express, Prisma, and Turborepo.
Draw App allows multiple users to sketch, brainstorm, and design together instantly on a shared canvas — with persistent storage and live sync.

## 🚀 Features

✏️ Drawing Tools
Rectangle, Circle, Diamond
Pencil
Arrow
Text
Image insertion
Eraser
Undo / Redo (coming soon)
⚡ Real-Time Collaboration
WebSocket-powered live drawing sync
Multi-user rooms
JWT-authenticated WebSocket connection
Cursor-based interactions (optional extension)
🗄️ Reliable Persistence
All drawing operations are saved in PostgreSQL
Prisma-backed ORM
Efficient loading of existing shapes on room join
🧩 Modular Architecture
Turborepo-based monorepo
Shared backend utilities
Clean separation of concerns

```sh
npx create-turbo@latest
```

## 🌐 Live Architecture Overview

```mermaid
flowchart TD

A[Frontend - Next.js Canvas] -- WebSocket --> B[WS Backend - Realtime Updates]

A -- REST --> C[HTTP Backend - Prisma + Express]

B -- DB Queries --> C

C -- Prisma --> D[(PostgreSQL Database)]
```



## 🏗️ Project Structure

```text
.
├── apps
│   ├── frontend        → Next.js 15 collaborative canvas UI
│   ├── http-backend    → Express API (Prisma CRUD)
│   └── ws-backend      → WebSocket real-time sync server

├── packages
│   ├── db              → Prisma schema + generated client
│   ├── ui              → Shared UI components
│   └── backend-common  → Shared env + constants + JWT secret
└── turbo.json


```





### 💬 WebSocket Message Examples
Join Room
{
  "type": "join_room",
  "roomId": "abc-123"
}

Send Shape Event
{
  "type": "chat",
  "roomId": "abc-123",
  "message": "{"shape": {...}}"
}

### 📦 Tech Stack
Frontend
Next.js 15
React 19
Tailwind CSS
Canvas API
Framer Motion
Backend
Express.js
WS WebSocket Server
Prisma ORM
PostgreSQL

Turborepo
pnpm workspaces





## 📎 Screenshots

UI Overview
<img width="2902" height="1664" alt="image" src="https://github.com/user-attachments/assets/0b6fe6e2-f93c-4b82-a11b-6e6988ac6f66" />
<img width="2934" height="1676" alt="image" src="https://github.com/user-attachments/assets/51ab181a-35fb-4a33-863c-f96cce7fb3be" />
<img width="2930" height="866" alt="image" src="https://github.com/user-attachments/assets/a56dbe9a-4322-475d-8b7d-9a17080622be" />
<img width="2898" height="1664" alt="image" src="https://github.com/user-attachments/assets/4a52501f-43fa-4486-9f80-37329bbd8518" />
<img width="2938" height="1648" alt="image" src="https://github.com/user-attachments/assets/e5cb3856-d651-4914-a9d7-80a501aa70c6" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/20d03b3c-b641-445a-833c-aa8d9906c7d3" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/ca969490-cefd-4aa7-8408-55f72da0c111" />







