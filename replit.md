# Laysa Tavares Nutricionista - Portfolio Website

## Overview
This is a static portfolio website for Laysa Tavares, a nutritionist based in Ibirapuã, BA, Brazil. The site showcases her services, methodology, testimonials, and contact information.

## Tech Stack
- **HTML5** with inline React components using Babel standalone for in-browser JSX compilation
- **React 18.2.0** (UMD development build)
- **Tailwind CSS** (CDN version)
- **Python 3.11** static file server

## Project Structure
```
/
├── index.html      # Main HTML file with React components
├── server.py       # Python HTTP server for development
├── logo.png        # Site logo
├── profile.jpg     # Profile photo
├── .gitignore      # Git ignore file
└── replit.md       # This documentation
```

## Running Locally
The site is served using a simple Python HTTP server:
```bash
python server.py
```
Server runs on `http://0.0.0.0:5000`

## Features
- Responsive design for mobile and desktop
- Hero section with profile photo and call-to-action
- Services section (Presencial, Online, Bioimpedância)
- Methodology section (Emagrecimento, Comportamento, Reeducação)
- Testimonials carousel
- Contact form (footer)
- Floating action buttons (WhatsApp, Instagram)

## Deployment
This is a static website. For production deployment, use the static deployment target with the root directory (`.`) as the public directory.

## Notes
- The site uses CDN-hosted libraries (Tailwind, React, Babel) which are suitable for development but should ideally be bundled for production
- Icons are implemented as inline SVG components to avoid external dependencies
