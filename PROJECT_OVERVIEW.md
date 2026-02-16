# MrPiglr Website - Project Overview

## 1. Project Identity & Purpose
The website is a comprehensive personal brand platform for **MrPiglr**, a "Computer Cowboy," Game Developer, and Founder of AeThex. It serves multiple functions:
- **Portfolio:** Showcasing game development work, web projects, and creative endeavors.
- **Content Hub:** Centralizing music releases, written books, blog posts, and live events.
- **Community Platform:** Hosting user profiles, a member directory, badges/achievements, and (planned) forums.
- **E-Commerce Store:** Selling merchandise and digital services (consultancy).
- **Admin Management:** A full CMS to manage all aspects of the site without code changes.

## 2. Technology Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Styling:** TailwindCSS 3.3 with Shadcn UI components
- **Icons:** Lucide React & React Icons
- **Animations:** Framer Motion
- **Backend / Database:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **E-Commerce Engine:** Hostinger Ecommerce API (Custom Integration)
- **Maps:** Leaflet / React-Leaflet

## 3. Sitemap & Routing Structure

### Public Routes
Accessible to all visitors.
- **`/` (Home):** Landing page with hero section, featured merchandise, and introduction.
- **`/about`:** Detailed timeline of MrPiglr's career and skills.
- **`/bio`:** Personal biography.
- **`/contact`:** Formspree-integrated contact form.
- **`/socials`:** Aggregated list of social media links.
- **`/press-kit`:** Downloadable brand assets (logos, colors, fonts).
- **`/faq`:** Frequently Asked Questions.
- **`/terms-of-service` & `/privacy-policy`:** Legal pages.

### Content Libraries
- **`/music`:** Interactive music player showcasing YouTube releases and playlists.
- **`/books`:** Library of written works with metadata and ratings.
- **`/read-book/:bookId`:** Interface for reading book content directly on the site.
- **`/blog`:** List of "Digital Logbook" posts.
- **`/blog/:slug`:** Individual blog post view with comments and likes.
- **`/portfolio`:** Gallery of project case studies (Games, Web, VR).
- **`/portfolio/:slug`:** Detailed view of a specific portfolio project.
- **`/events`:** Calendar of upcoming and past live streams/events.
- **`/browse`:** Directory summarizing all content categories.

### E-Commerce & Services
- **`/store`:** Product listing page fetching from Ecommerce API.
- **`/product/:id`:** Detailed product view with variant selection and cart functionality.
- **`/services`:** List of consultancy services with inquiry forms.

### Community & User System
- **`/members`:** Directory of registered community members.
- **`/profile/:username`:** Public user profiles displaying bio, social links, and earned badges.
- **`/login` & `/signup`:** Authentication pages using Supabase Auth.
- **`/dashboard`:** Protected user area for profile editing, settings, and viewing stats (XP, Loyalty Points).

### Administration (Protected)
Accessible only to users with 'admin', 'site_owner', or 'oversee' roles.
- **`/admin`:** The central control panel containing multiple managers:
    - **Dashboard:** High-level site statistics.
    - **Site Status:** Controls for "Maintenance Mode" or "Coming Soon" screens.
    - **Content Managers:** Interfaces to Create/Read/Update/Delete (CRUD) for Blog, Music, Books, Portfolio, Events, Socials, Inspirations, and Fan Art.
    - **User Management:** Role assignment and Badge granting system.
    - **Services & Inquiries:** Manage service listings and view incoming client inquiries.

## 4. Key Features
- **Dynamic Content:** Almost all content (except hardcoded structural elements) is fetched from Supabase tables, allowing for real-time updates via the Admin Panel.
- **Gamification:** Users earn XP and Loyalty Points. The system supports a Badge infrastructure for awarding achievements.
- **Role-Based Access Control (RBAC):** Strict protection on Admin routes and specific database actions using Supabase RLS policies and frontend route guards.
- **Dark/Cyberpunk Aesthetic:** The site utilizes a consistent "Electrolize" font, neon color palette (Purples/Pinks), and grid backgrounds to match the "Computer Cowboy" brand.
- **Real-time Updates:** Utilizes Supabase Realtime for features like notifications and dashboard stats.

## 5. Current State Notes
- **Unused Routes:** Files for `FanArtPage`, `InspirationsPage`, and `ForumPage` exist in the codebase but are not currently wired into the main `src/App.jsx` router, making them inaccessible via direct navigation in the current build.
- **Creations:** A `CreationsPage` exists but returns `null`, likely serving as a placeholder or deprecated in favor of the Portfolio system.