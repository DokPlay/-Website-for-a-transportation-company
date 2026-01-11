Русская версия: [READMERU.md](READMERU.md)

# LogisticPro - Transportation Company Website
https://929f60f1.website-for-a-transportation-company.pages.dev/static/

## 📋 Project Overview

Modern, responsive website for the LogisticPro transportation company. A full-featured prototype with a delivery cost calculator, request form, and service information. Deployed on Cloudflare Pages using the Hono framework.



<img width="1536" height="1034" alt="Снимок экрана 2026-01-11 112029" src="https://github.com/user-attachments/assets/c89fb264-d4f7-471a-aaa8-7881c339ec9d" />

## ✅ Implemented Features

### 🏠 Home Page (`/static/index.html`)
- Hero section with key information and CTA buttons
- Overview of the company’s core services
- Advantages of working with the company (6 benefits)
- “How it works” block (4 steps)
- Company stats (10+ years, 5000+ clients)
- Quick request form
- CTA block to jump to the calculator

### 📦 Service Pages (`/static/services/`)
- **Cargo transportation** (`cargo.html`) — transport types, fleet, advantages
- **Express delivery** (`express.html`) — urgent delivery options, timeframes, guarantees
- **Intercity delivery** (`regional.html`) — directions, regional coverage
- **Corporate clients** (`corporate.html`) — loyalty program, document workflow

### 🧮 Delivery Calculator (`/static/calculator.html`)
- Select origin and destination cities (10 cities)
- Specify cargo weight and volume
- Automatic volume calculation by dimensions
- Service type selection (Standard, Express, Economy)
- Additional services (insurance, packaging, loading, door delivery)
- Automatic cost calculation

### 📝 Request Form (`/static/request.html`)
- Contact information (name, company, phone, email)
- Preferred contact method (phone, WhatsApp, Telegram, email)
- Delivery route (cities and addresses)
- Cargo information (type, weight, volume, value)
- Additional services (checkboxes)
- Form validation

### 📍 Contacts (`/static/contacts.html`)
- Primary contact information
- Links to WhatsApp and Telegram
- Working hours
- Interactive map (Google Maps)
- Company departments
- Regional branches (6 cities)

### 🔌 API Endpoints
- `GET /` - redirect to the home page
- `GET /api/health` - server health check
- `GET /static/*` - static files (HTML, CSS, JS)

## 📁 Project Structure

```
webapp/
├── src/
│   └── index.tsx           # Hono app (API endpoints)
├── public/
│   └── static/
│       ├── index.html      # Home page
│       ├── calculator.html # Delivery calculator
│       ├── request.html    # Request form
│       ├── contacts.html   # Contacts
│       ├── css/            # Styles
│       │   ├── style.css
│       │   ├── services.css
│       │   ├── calculator.css
│       │   ├── request.css
│       │   └── contacts.css
│       ├── js/             # JavaScript
│       │   ├── main.js
│       │   ├── calculator.js
│       │   └── request.js
│       └── services/       # Service pages
│           ├── cargo.html
│           ├── express.html
│           ├── regional.html
│           └── corporate.html
├── dist/                   # Compiled files
│   ├── _worker.js          # Cloudflare Worker
│   ├── _routes.json        # Cloudflare Pages routes
│   └── static/             # Copy of static files
├── .git/                   # Git repository
├── .gitignore              # Git ignore
├── ecosystem.config.cjs    # PM2 config
├── wrangler.jsonc          # Cloudflare config
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

## 🎨 Technologies

### Backend
- **Hono** v4.6 - lightweight web framework for Cloudflare Workers
- **TypeScript** v5.6 - typed JavaScript
- **Cloudflare Workers** - edge runtime for the backend
- **Vite** v5.4 - module bundler

### Frontend
- **HTML5** - semantic markup
- **CSS3** - modern styles, CSS Variables, Flexbox, Grid
- **JavaScript (ES6+)** - interactivity without frameworks
- **Font Awesome 6** - icons (CDN)
- **Google Fonts (Inter)** - typography (CDN)
- **Google Maps** - map on the contacts page

## 🚀 Local Development

### Install dependencies
```bash
cd /home/user/webapp
npm install
```

### Build the project
```bash
npm run build
# Creates dist/ with _worker.js, static files, and _routes.json
```

### Run the local server (PM2)
```bash
# Clear the port (if needed)
npm run clean-port

# Start with PM2
pm2 start ecosystem.config.cjs

# Check status
pm2 list

# View logs
pm2 logs logistikpro --nostream

# Restart
pm2 restart logistikpro

# Stop
pm2 delete logistikpro
```

### Testing
```bash
# Check the home page
curl -L http://localhost:3000/

# Check the API
curl http://localhost:3000/api/health

# Check static assets
curl -L http://localhost:3000/static/calculator.html
```

## 📦 Deployment to Cloudflare Pages

### Preparation

1. **Set up the Cloudflare API key** (required):
```bash
# Call the setup_cloudflare_api_key tool
# If it is not configured, go to the Deploy tab to set it up
```

2. **Check cloudflare_project_name**:
```bash
# Read the existing name or use logistikpro by default
# If there is a conflict, add a number (logistikpro-2, logistikpro-3)
```

### Deploy

```bash
# Build the project
npm run build

# Create the Cloudflare project (first time)
npx wrangler pages project create logistikpro \
  --production-branch main \
  --compatibility-date 2024-01-01

# Deploy to Cloudflare Pages
npm run deploy:prod

# You will get a URL like:
# Production: https://logistikpro.pages.dev
# Branch: https://main.logistikpro.pages.dev
```

### Update after deployment
```bash
# Save the final project name in meta_info
# meta_info(action="write", key="cloudflare_project_name", value="logistikpro")
```

## 🔗 Functional URIs

| Page | Path | Description |
|----------|------|----------|
| Home | `/` or `/static/index.html` | Website home page |
| Calculator | `/static/calculator.html` | Online cost calculator |
| Request | `/static/request.html` | Extended request form |
| Contacts | `/static/contacts.html` | Contact information |
| API Health | `/api/health` | API health check |
| Cargo transportation | `/static/services/cargo.html` | Cargo transportation service |
| Express | `/static/services/express.html` | Express delivery |
| Intercity | `/static/services/regional.html` | Intercity delivery |
| Corporate | `/static/services/corporate.html` | Business services |

## 🔄 Git Commands

```bash
# Repository is already connected to GitHub
# https://github.com/DokPlay/-Website-for-a-transportation-company

# Add changes
git add .

git commit -m "describe changes"

# Push to GitHub
git push origin main

# Pull changes
git pull origin main

# Check status
git status

# View history
git log --oneline
```

## 📱 Responsive Design

- Full adaptation for mobile devices
- Mobile menu (burger)
- Breakpoints: 1024px, 768px, 480px
- Optimized forms for mobile screens

## 🚀 Recommendations for further development

### High priority
1. **Backend integration** - connect forms to APIs for email sending/saving to D1
2. **Cloudflare D1 Database** - store requests and calculations
3. **Email notifications** - integrate with SendGrid/Mailgun via API

### Medium priority
4. **User account** - authentication, order history
5. **About page** - history, mission, team
6. **Shipment tracking** - search by waybill number
7. **Blog/News** - useful articles

### Low priority
8. **Multilingual support** - English language support
9. **Dark theme** - alternative color scheme
10. **PWA** - progressive web app



## 📄 License

Prototype created for demonstration purposes.

---

*Developed on Cloudflare Pages + Hono for efficient logistics* 🚚
