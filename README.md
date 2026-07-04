# 🎨 Draw App — Real-Time Collaborative Whiteboard

A real-time collaborative drawing app inspired by Excalidraw, built with **Next.js**, **WebSockets**, **Express**, **Prisma**, and **Turborepo**. Multiple people can sketch, brainstorm, and design together on the same canvas — with persistent storage, live sync, and an editor experience that feels close to a native design tool.

---

## 🚀 Features

### ✏️ Drawing Tools
- Rectangle, Circle, Diamond, Line, Arrow
- Freehand Pencil
- Text (click to type, double-click to edit, adjustable font size/alignment/opacity)
- Image insertion
- Eraser

### 🖱️ Selection & Editing
- **Click-select** a single shape by its border and resize it with corner handles (aspect-ratio lock with Shift)
- **Marquee (drag-box) select** — draws a selection box and grabs every shape *fully enclosed* inside it, so you can box-select a whole group (e.g. a big figure plus everything drawn inside it) without accidentally grabbing shapes that only partially overlap the box
- **Group move** — once a group is marquee-selected, click and drag anywhere inside the group's bounds to move all of them together
- Shift-click to add/remove individual shapes from a selection
- Layer reordering (bring forward / send backward) for the active selection
- Double-click text to edit it in place

### 🧭 Canvas Navigation
- Zoom in/out with on-screen controls or `Ctrl`/`Cmd` + scroll
- Pan with the dedicated cursor/hand tool or by scrolling
- "Zoom to selection" to frame whatever's currently selected
- Light / dark theme toggle with a matching stroke palette for each

### ⚡ Real-Time Collaboration
- WebSocket-powered live drawing sync across all clients in a room
- Multi-user rooms with JWT-authenticated WebSocket connections
- Add collaborators to a room by email
- Access control — rooms enforce who's allowed to join

### 🗄️ Reliable Persistence
- All shapes are saved to PostgreSQL via Prisma
- Existing shapes load automatically when you join a room
- Shape updates (move, resize, edit, reorder) and deletions sync and persist in real time

### 🧩 Modular Architecture
- Turborepo-based monorepo with shared packages
- Clean separation between the frontend, the WebSocket server, and the HTTP API

---

## 🏗️ Project Structure

```
.
├── apps
│   ├── frontend        → Next.js canvas UI (drawing engine, toolbar, rooms)
│   ├── http-backend    → Express API (Prisma CRUD, auth, room/collaborator management)
│   └── ws-backend      → WebSocket server for real-time shape sync
│
├── packages
│   ├── db              → Prisma schema + generated client
│   ├── ui              → Shared UI components
│   └── backend-common  → Shared env vars, constants, JWT secret
│
└── turbo.json
```

---

## 🌐 Architecture Overview

```mermaid
flowchart TD
    A[Frontend - Next.js Canvas] -- WebSocket --> B[WS Backend - Realtime Sync]
    A -- REST --> C[HTTP Backend - Express + Prisma]
    B -- DB Queries --> C
    C -- Prisma --> D[(PostgreSQL Database)]
```

- The canvas talks to the **WS backend** for live shape create/update/move/erase/reorder events, broadcast to everyone else in the same room.
- The canvas talks to the **HTTP backend** for auth, room access checks, adding collaborators, and loading existing shapes on join.
- The **HTTP backend** is the only service that talks to Postgres, through Prisma.

---

## 📦 Tech Stack

**Frontend**
- Next.js 15, React 19
- TypeScript
- Tailwind CSS
- HTML5 Canvas API (custom drawing engine — no canvas library)
- Framer Motion (UI animations)
- react-hot-toast

**Backend**
- Express.js (HTTP API)
- `ws` WebSocket server (real-time sync)
- Prisma ORM
- PostgreSQL
- JWT authentication

**Tooling**
- Turborepo
- pnpm workspaces

---

## 🛠️ Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm
- A running PostgreSQL instance

### 1. Clone & install

```bash
git clone https://github.com/Rohan77ux/Draw-App.git
cd Draw-App
pnpm install
```

### 2. Configure environment variables

Each app under `apps/` and the `packages/db` package needs its own `.env`. At minimum you'll need:

```bash
# apps/http-backend/.env & apps/ws-backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/drawapp"
JWT_SECRET="your-secret-key"

# apps/frontend/.env
NEXT_PUBLIC_HTTP_BACKEND_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
```

> Adjust ports/URLs to match your local setup.

### 3. Set up the database

```bash
cd packages/db
pnpm prisma generate
pnpm prisma migrate dev
```

### 4. Run the apps (from the repo root)

```bash
pnpm dev
```

This uses Turborepo to start the frontend, HTTP backend, and WS backend together. To run a single app instead:

```bash
pnpm --filter frontend dev
pnpm --filter http-backend dev
pnpm --filter ws-backend dev
```

---

## 💬 WebSocket Message Examples

**Join a room**
```json
{
  "type": "join_room",
  "roomId": "abc-123"
}
```

**Broadcast a new/updated shape**
```json
{
  "type": "chat",
  "roomId": "abc-123",
  "message": "{\"shape\": { \"id\": \"...\", \"type\": \"rect\", \"x\": 100, \"y\": 100, \"width\": 200, \"height\": 120, \"color\": \"#1e1e1e\" } }"
}
```

**Erase a shape**
```json
{
  "type": "chat",
  "roomId": "abc-123",
  "message": "{\"eraseId\": \"shape-id-here\"}"
}
```

**Reorder layers**
```json
{
  "type": "reorder",
  "roomId": "abc-123",
  "order": ["shape-id-1", "shape-id-2", "shape-id-3"]
}
```

---

## 🗺️ Roadmap

- [ ] Undo / redo
- [ ] Explicit shape grouping (persisted parent/child relationships, beyond bounding-box inference)
- [ ] Live multi-user cursors
- [ ] Export canvas to PNG/SVG

---

## 🤝 Contributing

Issues and PRs are welcome. If you're adding a new drawing tool or canvas interaction, please keep the shape-sync contract (`shape`, `updateShape`, `eraseId`, `reorder` message types) intact so existing rooms/clients stay compatible.

## 📄 License

No license specified yet — all rights reserved by the author until one is added.
