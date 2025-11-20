# 🏥 MedVault

**Privacy-First Medical Document Manager**

A zero-backend, client-side web application for medical professionals to organize documents in Google Drive using camera capture and file uploads.

## 🔒 Privacy First

- **Zero-access architecture** - We never see, store, or access your files
- **Client-side only** - Runs entirely in your browser, no backend server
- **Minimal permissions** - Only accesses files you create through MedVault
- **HIPAA-compliant design** - No PHI stored or transmitted to third parties
- **Session-based** - All data cleared when you close the browser

## ✨ Features

- 🔐 Google OAuth authentication
- 📁 List and create folders in Google Drive
- 📸 Camera capture with custom naming (mobile & desktop)
- 📤 File upload from gallery or local files
- 🔍 Search folders by name
- 📱 Fully responsive (works on mobile & desktop browsers)

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Project** with OAuth 2.0 credentials
2. **Node.js** (v18 or higher)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your Google credentials
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🌐 Deployment

Deploy to **Cloudflare Pages** (recommended) or Vercel for free static hosting.

## 📁 Project Structure

```
medvault/
├── src/
│   ├── components/       # React components
│   ├── services/         # Google Auth & Drive API
│   ├── hooks/            # Custom React hooks
│   ├── context/          # State management
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── public/               # Static assets
└── README.md             # This file
```

## 🔧 Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Google OAuth 2.0 + Drive API
- Cloudflare Pages (hosting)

## 📄 License

MIT License - Free to use and modify

---

**Built with privacy in mind. Your data stays yours. Always.**
