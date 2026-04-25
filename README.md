# **Chiranth D Nandi's Personal Portfolio Website created using MERN stack.**

A responsive, animated personal portfolio built with **React + Vite**, featuring custom WebGL visuals, a scroll-aware navigation system, and a full-stack likes backend.

🌐 **Live site:** https://chiranth-nandi.vercel.app/

---

## Features

- **Animated hero** — interactive 3D Orb rendered with OGL (WebGL) and an animated Dot Grid background, both built as custom React components
- **Scroll-aware navbar** — switches text color dynamically based on whichever section is in view
- **Image carousels** — per-section carousels with GitHub links and a per-project like counter
- **Scrolling tech ticker** — auto-playing logo loop of the full tech stack
- **3D Dome Gallery** — custom Three.js photo gallery component
- **Responsive layout** — fully adapted for mobile with a hamburger menu and dynamically recalculated timeline positioning
- **Likes backend** — per-project like counters persisted via Express + MongoDB, with a JSON file fallback when no DB is configured
- **Resume request gating** — secure resume access via email-verified form with admin approval before sending

---

## Tech Stack

**Frontend**

| Layer | Library / Tool |
|---|---|
| Framework | React 19, Vite 7 |
| Styling | Tailwind CSS v4, custom CSS |
| Animation | GSAP 3, Motion (Framer), `@use-gesture/react` |
| 3D / WebGL | Three.js, OGL, `postprocessing` |
| Icons | `react-icons`, `@tabler/icons-react`, Lucide |
| UI Primitives | Radix UI (Slot), shadcn/ui (Carousel) |
| Timeline | `react-vertical-timeline-component` |

**Backend**

| Layer | Library / Tool |
|---|---|
| Server | Node.js, Express |
| Database | MongoDB (Mongoose) / JSON file fallback |
| Email | Nodemailer (Gmail SMTP) |
| Config | `dotenv` |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### Frontend

```bash
git clone https://github.com/Chiranth-D-Nandi/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Backend (enables per-project likes & resume gating)

```bash
cd server
npm install
# Create a .env file:
# RESUME_EMAIL=your-email@gmail.com
# RESUME_EMAIL_PASSWORD=your-app-password (16 chars from Google Account)
# BASE_URL=http://localhost:5000 (local) or https://your-domain.com (production)
# MONGODB_URI=<optional MongoDB URI>
# PORT=5000
npm start
```

Also add your resume to `server/resume/chiranth_cv.pdf` (this folder is in `.gitignore` for privacy).

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
portfolio/
├── public/              # Static assets (images, GIFs)
├── server/              # Express backend (likes API, resume gating)
│   ├── resume/          # Resume storage (private, in .gitignore)
│   └── index.js
├── src/
│   ├── assets/
│   │   └── carouselImages.js   # Image arrays for each section's carousel
│   ├── components/ui/
│   │   ├── carousel.jsx              # Image carousel with like button
│   │   ├── DomeGallery.jsx           # 3D dome photo gallery (Three.js)
│   │   ├── DotGrid.jsx               # Animated dot-grid background
│   │   ├── LogoLoop.jsx              # Scrolling tech-logo ticker
│   │   ├── Orb.jsx                   # Interactive WebGL orb (OGL)
│   │   ├── ResumeRequestModal.jsx    # Resume request form modal
│   │   └── ResumeRequestModal.css
│   ├── hooks/
│   │   └── useNavColor.js      # Scroll-aware nav color hook
│   ├── App.jsx                 # Main page layout and all sections
│   └── main.jsx
├── vite.config.js
└── tailwind.config.js
```

---

## Resume Request System

The resume is protected behind a gated request system for privacy:

1. **User clicks "Download Resume"** → Modal form opens
2. **User fills form** — Email (required), Name (required), Reason (Employer/Professor/Others)
   - If "Employer" is selected, user must provide company name
   - If "Others" is selected, user must provide custom reason
3. **Form submitted** → Email sent to admin with:
   - All request details
   - **ACCEPT & SEND RESUME** button (automatic email sent to requester with resume)
   - **REJECT REQUEST** button (silently discards request)
4. **Resume delivered**

The resume file itself is never publicly accessible and is stored in `server/resume/` (Git-ignored for privacy).

---

## Contact

- **LinkedIn:** [chiranth-nandi](https://www.linkedin.com/in/chiranth-nandi)
- **GitHub:** [Chiranth-D-Nandi](https://github.com/Chiranth-D-Nandi)
- **Resume:** available for download on the live site
