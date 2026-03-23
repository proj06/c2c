# C2C Club — Campus to Corporate, Chandigarh University

A full-stack dynamic website with MongoDB-backed user accounts, JWT auth, and an admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JS |
| Backend | Node.js + Express |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (stored in HttpOnly cookie) |

---

## Project Structure

```
c2c-club/
├── public/                  # Static frontend
│   ├── index.html           # Main website
│   ├── login.html           # Standalone login/register page
│   ├── admin.html           # Admin dashboard
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/              # Put your team/event images here
│       ├── ishdeep.jpeg
│       ├── navneet.jpeg
│       ├── sujoy.jpeg
│       ├── drishti pannu.jpeg
│       ├── Event1.jpeg … Event6.jpeg
├── server/
│   ├── index.js             # Express entry point
│   ├── models/
│   │   └── User.js          # Mongoose user model
│   ├── routes/
│   │   ├── auth.js          # /api/auth/*
│   │   └── admin.js         # /api/admin/*
│   └── middleware/
│       └── auth.js          # JWT verification
├── .env.example             # Copy to .env and fill in
└── package.json
```

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/c2c-club
JWT_SECRET=some_long_random_string_here
PORT=3000
NODE_ENV=development
```

**Get a free MongoDB URI:** https://www.mongodb.com/cloud/atlas  
(Create cluster → Connect → "Connect your application" → copy URI)

### 3. Add your images

Place your team/event images in `public/images/`:
- `ishdeep.jpeg`, `navneet.jpeg` (faculty)
- `sujoy.jpeg`, `drishti pannu.jpeg` (student leadership)
- `Event1.jpeg` … `Event6.jpeg` (gallery)

### 4. Configure the Google Form

In `public/index.html`, find the `<iframe>` in the contact section and replace the `src` with your actual Google Form **embed** URL:

1. Open your Google Form
2. Click **Send** → **Embed** tab
3. Copy the iframe `src` URL (ends with `?embedded=true`)
4. Paste it into the iframe in index.html

### 5. Run the server

**Development (with auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Open http://localhost:3000

---

## Creating Your First Admin

After starting the server, register a normal account via the website. Then promote it to admin directly in MongoDB:

```js
// In MongoDB Atlas → Browse Collections → users
// Or via MongoDB Compass / mongosh:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Then log in and visit `/admin`.

---

## API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `name, email, password, studentId?, branch?, year?` | Register |
| POST | `/api/auth/login` | `email, password` | Login |
| POST | `/api/auth/logout` | — | Logout (clears cookie) |
| GET | `/api/auth/me` | — | Get current user |

### Admin (requires admin JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Member statistics |
| GET | `/api/admin/members?page=1&limit=15&search=` | List members |
| PATCH | `/api/admin/members/:id/role` | Change role |
| PATCH | `/api/admin/members/:id/status` | Activate/deactivate |
| DELETE | `/api/admin/members/:id` | Delete member |

---

## Deployment (e.g. Render, Railway, Vercel)

1. Push to GitHub
2. Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `PORT`)
3. Build command: `npm install`
4. Start command: `npm start`

---

## Google Form (Dark Mode Trick)

The Google Form iframe uses a CSS filter (`invert + hue-rotate`) to blend it into the dark theme. If you prefer the original Google Form colours, remove this line from `style.css`:

```css
filter: invert(0.9) hue-rotate(180deg);
```
