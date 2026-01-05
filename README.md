Nexus — A Modern Mini Social Media App

A full-stack social media application built using React + Tailwind CSS, Express.js, and SQLite. Nexus supports authentication, posts, comments, likes, follows, notifications, profile editing, dark mode, and more — a full real-world social platform foundation.

-- Table of Contents

Overview

Features

Tech Stack

Project Structure

Installation

Environment Variables

Running the Project

API Overview

Common Issues

License

-- Overview

Nexus is a complete mini-social network project designed with clean UI, smooth UX, persistent auth, and full CRUD operations. It’s perfect for:

Portfolio / Resume projects

Learning full-stack development

Real social-app prototypes

Scalable extension into a production-like system

-- Features User Features

Register & Login with JWT

Automatic token refresh

Edit profile

Upload avatar

Dark/Light mode toggle

Toast notifications

Social Features

Create posts (text + images)

Edit/Delete own posts

Like/Unlike posts

Comment system

Follow/Unfollow users

Suggested users

Full profile page with stats

Notifications

Like notifications

Follow notifications

Mark as read

UI/UX

Modern card-based layout

Responsive design

Shared button/card components

Micro-interactions

Smooth transitions

Professional dark mode

-- Tech Stack Frontend

React 18

React Router

Tailwind CSS

Axios

Phosphor Icons

Backend

Node.js

Express

JWT Authentication

Multer (Image upload)

SQLite

Dev Tools

Vite (frontend)

Nodemon (backend)

ESLint

-- Project Structure mini-social/ │ ├── client/ │ ├── src/ │ │ ├── api/ │ │ ├── components/ │ │ ├── context/ │ │ ├── pages/ │ │ ├── utils/ │ │ └── index.css │ └── index.html │ ├── server/ │ ├── controllers/ │ ├── middleware/ │ ├── routes/ │ ├── utils/ │ ├── data/ │ ├── db.js │ └── server.js │ ├── README.md └── .env.example

-- Installation

Clone the Repository git clone https://github.com/SwayamRoman1/CodeAlpha_MiniSocialMediaApp.git cd mini-social

Backend Setup cd server npm install cp .env.example .env npm run dev

Backend runs at:

http://localhost:4000

Frontend Setup cd client npm install npm run dev
Frontend runs at:

http://localhost:5173

-- Environment Variables

Create a .env file inside server/:

PORT=4000 JWT_SECRET=secret_key_atually_not_so_sectret REFRESH_SECRET=another_secret_key_that_atually_not_is_so_secret DB_FILE=./data/social.db

Your app will NOT work without valid secrets.

-- API Overview Auth

POST /api/v1/auth/register

POST /api/v1/auth/login

POST /api/v1/auth/refresh

Users

GET /api/v1/users/me

GET /api/v1/users/:username

PATCH /api/v1/users/me

PATCH /api/v1/users/me/avatar

Posts

GET /api/v1/posts/feed

POST /api/v1/posts

PATCH /api/v1/posts/:id

DELETE /api/v1/posts/:id

POST /api/v1/posts/:id/like

POST /api/v1/posts/:id/unlike

Comments

GET /api/v1/comments/:postId

POST /api/v1/comments/:postId

Follows

POST /api/v1/follows/:id/follow

POST /api/v1/follows/:id/unfollow

Notifications

GET /api/v1/notifications

POST /api/v1/notifications/:id/read

-- Common Issues

“Invalid Token”
Fix:

localStorage.clear()

Restart backend & frontend.

Blank Page / White Screen
Run:

npm i clsx phosphor-react axios

Check browser console for missing imports.

Feed 404
Backend route must exist:

GET /api/v1/posts/feed

Images Not Loading
Ensure:

/uploads

folder exists inside server/.

-- License

MIT License © 2025 — Free to use & modify.
