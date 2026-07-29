# ⚡ TBM Power — Corporate Website

> **Reliable Power Solutions for Modern Industries**  
> A professional multi-page static website for TBM Power, a premier industrial electrical engineering firm specializing in high-voltage power systems, industrial automation, and turnkey energy infrastructure.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Pages](#pages)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Design System](#design-system)
- [Services Covered](#services-covered)
- [Contact Information](#contact-information)

---

## 🏢 Overview

The **TBM Power** corporate website is a fully static, multi-page HTML/CSS/JS site designed to present the company's capabilities, portfolio, products, and contact information to industrial clients worldwide. The site is built with modern web design aesthetics — featuring smooth scroll animations, a responsive mobile-first layout, and a professional navy-and-orange color scheme.

**Company Background:**  
Founded in 2006, TBM Power has grown from a relay testing outfit into a full-scale industrial electrical engineering firm with 20+ years of experience, 150+ completed projects, and 80+ corporate clients across heavy manufacturing, utility grids, pharmaceutical hubs, and chemical refineries.

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Landing page with hero, services overview, featured projects, products, testimonials, and process timeline |
| **About** | `about.html` | Company history, mission/vision/values, and executive leadership team |
| **Services** | `services.html` | Detailed descriptions of all engineering service offerings |
| **Projects** | `projects.html` | Portfolio of completed high-voltage and automation projects |
| **Products** | `products.html` | Equipment catalog — transformers, switchgear, and control enclosures |
| **Gallery** | `gallery.html` | Visual showcase of field work and installations |
| **Contact** | `contact.html` | Contact form, office address, and inquiry details |

---

## ✨ Features

- **Page Load Animation** — Branded spinner with company name before content renders
- **Sticky Navigation Header** — Transparent-to-solid scroll transition with active link highlighting
- **Mobile Hamburger Menu** — Fully responsive collapsible navigation for small screens
- **Scroll-Triggered Animations** — Elements animate into view using Intersection Observer API (fade-up, fade-left, fade-right, zoom-in effects)
- **Animated Counter Stats** — Numbers count up to target values when scrolled into view (20+ Years, 150+ Projects, 80+ Clients, 100% Satisfaction)
- **Testimonials Slider** — Touch/click navigable carousel of client testimonials
- **Infinite Logo Carousel** — CSS-animated scrolling strip of client logos
- **Scroll-to-Top Button** — Appears on scroll, returns to page top smoothly
- **SEO Optimized** — Descriptive `<title>` tags, `<meta>` descriptions, semantic HTML5, and proper heading hierarchy on every page
- **Fully Responsive** — Adapts from mobile (360px) to large desktop (1400px+)

---

## 📁 Project Structure

```
TBM/
├── index.html          # Home page
├── about.html          # About Us page
├── services.html       # Services page
├── projects.html       # Projects portfolio page
├── products.html       # Products catalog page
├── gallery.html        # Gallery page
├── contact.html        # Contact page
├── README.md           # Project documentation
│
├── css/
│   └── styles.css      # Main stylesheet (design system, components, responsive)
│
├── js/
│   └── main.js         # JavaScript (animations, slider, counters, navigation)
│
└── Images/
    ├── Logo.jpg         # Company logo (used in navbar & footer)
    ├── Hero image.png   # Hero section main visual
    └── Banner.png       # About section banner image
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic page structure & content |
| **CSS3 (Vanilla)** | Layout, animations, design system (CSS custom properties) |
| **JavaScript (Vanilla)** | Interactivity — scroll animations, slider, counters, mobile nav |
| **Google Fonts** | Typography — `Poppins` (headings) & `Inter` (body text) |
| **SVG Icons** | Inline scalable vector icons (no external icon library dependency) |

> **Zero external dependencies** — No frameworks, no npm packages, no build step required.

---

## 🚀 Getting Started

Since this is a fully static website, no build tools or server setup is required.

### Option 1 — Open Directly
Simply open `index.html` in any modern web browser:
```
Double-click index.html  →  Opens in your default browser
```

### Option 2 — Local Development Server
For a proper development experience with live reload, use any static server:

**Using VS Code Live Server extension:**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**Using Python:**
```bash
# Python 3
python -m http.server 8080
# Then visit: http://localhost:8080
```

**Using Node.js:**
```bash
npx serve .
# Then visit: http://localhost:3000
```

---

## 🎨 Design System

All design tokens are defined as CSS custom properties in `css/styles.css`:

```css
/* Color Palette */
--navy-900: #0a1628      /* Primary dark navy */
--navy-800: #0d1f3c      /* Secondary navy */
--orange-500: #f97316    /* Primary accent (CTA buttons) */
--orange-400: #fb923c    /* Hover accent */
--gray-600: #4b5563      /* Body text */
--white: #ffffff

/* Typography */
--font-primary: 'Poppins', sans-serif    /* Headings */
--font-secondary: 'Inter', sans-serif   /* Body */
```

### Animation Classes
Applied via JavaScript's Intersection Observer using the `reveal` class:

| Class | Effect |
|-------|--------|
| `reveal fade-up` | Slides up from below |
| `reveal fade-left` | Slides in from the left |
| `reveal fade-right` | Slides in from the right |
| `reveal zoom-in` | Scales up from center |
| `delay-100` … `delay-400` | Staggered animation delays |

---

## 🔧 Services Covered

The website showcases TBM Power's six core service areas:

1. **Electrical Installation & Grid Connection** — High-voltage (11kV–230kV) cable termination, busduct systems, earthing/ground grid design
2. **Turnkey Power Distribution** — AIS/GIS substations, MDB panels, automatic transfer switches (ATS)
3. **SCADA & Industrial Automation** — PLC programming (Siemens, Allen-Bradley, Schneider), SCADA dashboards, MCC & VFD synchronization
4. **Maintenance Services** — Preventive maintenance programs, thermal imaging, relay calibration, 24/7 emergency repairs
5. **Energy Solutions** — Power factor correction, energy audits, solar microgrid integration, energy storage systems
6. **Engineering Consultancy** — Arc flash analysis, load flow studies, technical drafting, compliance verification

### Products Catalog
- Industrial Oil-Cooled Transformers (500kVA – 25MVA)
- Medium Voltage Switchgear Panels (11kV/33kV)
- Smart PLC Control Enclosures (NEMA-4X, VFD integrated)

---

## 📞 Contact Information

| Field | Details |
|-------|---------|
| **Headquarters** | Industrial District, NY 10001 |
| **Phone** | +1 (800) 555-VOLT |
| **Email** | info@tbmpower.com |
| **Website** | www.tbmpower.com |

---

## 📜 License

© 2026 TBM Power Solutions. All Rights Reserved.  
This website and its contents are proprietary to TBM Power Solutions.

---

*Built with ⚡ for industrial-grade performance and reliability.*
