# Elysium Mind

Graphical Task Manager — React + Node.js

---

## Overview

Elysium Mind is a visual task management application that lets you create, organize, and link tasks as graphical modules. The interface is modern (Chakra UI, dark mode), and data is persisted via a Node.js/Express API.

- **Frontend**: React + Vite + Chakra UI + React Flow
- **Backend**: Node.js + Express (REST API)
- **Monorepo**: Everything in a single repository

---

## Project Structure

```
Elysium-mind/
├── backend/      # Node.js/Express API
│   └── index.js
├── frontend/     # React (Vite) application
│   └── src/
├── .gitignore
├── LICENSE
├── README.md
```

---

## Installation

### 1. Clone the repository
```sh
git clone https://github.com/<your-username>/Elysium-mind.git
cd Elysium-mind
```

### 2. Install dependencies

#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd ../frontend
npm install
```

---

## Running the Project

### 1. Start the backend (API)
```sh
cd backend
node index.js
```
The server runs at http://localhost:3001

### 2. Start the frontend (React)
```sh
cd frontend
npm run dev
```
Open your browser at the indicated URL (e.g., http://localhost:5173)

---

## Main Features
- Add, edit, and delete tasks
- Graphical visualization (drag & drop, links between tasks)
- Status, priority, and checkbox for each task
- Modern dark mode interface (Chakra UI)
- Data persistence via Node.js API

---

## License
MIT — see the LICENSE file
