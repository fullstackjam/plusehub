# PulseHub - Social Media Hot Topics Aggregation Platform

PulseHub is a modern React-based social media hot topics aggregation platform that collects and displays trending topics from multiple Chinese platforms in real-time. Built with TypeScript and Vite, it provides a clean, responsive interface for monitoring hot topics across Weibo, Douyin, Bilibili, Zhihu, Baidu, and Toutiao.

## 🚀 One-Click Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fullstackjam/pulsehub)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fullstackjam/pulsehub)

## ✨ Features

- 🔥 **Real-time Hot Topics Aggregation** - Collect trending topics from 6 major Chinese platforms
- 🎨 **Modern UI Design** - Features glassmorphism effects with gradient backgrounds and smooth animations
- 🖱️ **Drag & Drop Sorting** - Reorder platform cards with intuitive drag and drop functionality
- 🔄 **Independent Refresh** - Each platform card can refresh data independently
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🚀 **Pure Frontend Application** - No backend required, direct API calls from user's browser
- ⚡ **Fast Performance** - Built with Vite for optimal build speed and development experience
- 🔗 **Smart URL Generation** - Automatic link generation to search pages for each platform
- 📊 **Aggregated View** - Cross-platform hot topics detection and display

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Atomic CSS framework

### Data Sources
- **60s API** - Real-time hot topics aggregation service (https://60s.viki.moe)
- **Direct API Calls** - No proxy required, using user's IP for requests
- **CORS-enabled** - Cross-origin requests handled properly

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the project**
```bash
git clone https://github.com/fullstackjam/pulsehub.git
cd pulsehub
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
- Application: http://localhost:3000
- The development server will automatically reload when you make changes

### Docker Deployment

1. **Build Docker image**
```bash
npm run docker:build
```

2. **Run Docker container**
```bash
# Run in foreground
npm run docker:run

# Run in background
docker run -d -p 80:80 --name pulsehub pulsehub
```

3. **Access the application**
- Application URL: http://localhost

### Static Deployment

1. **Build for production**
```bash
npm run build
```

2. **Deploy to any static hosting service**
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Push the built files to gh-pages branch
- **Any web server**: Serve the `dist` folder

### Kubernetes Deployment

1. **Deploy using Helm**
```bash
# Create namespace
kubectl create namespace pulsehub

# Deploy application
helm install pulsehub ./helm/pulsehub -n pulsehub

# Check deployment status
kubectl get pods -n pulsehub
```

2. **Access the application**
- Application URL: https://pulsehub.fullstackjam.com

## 📁 Project Structure

```
PulseHub/
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard component with drag & drop
│   │   └── PlatformCard.tsx # Individual platform card component
│   ├── services/           # API services
│   │   └── api.ts          # 60s API integration and data transformation
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Type definitions for platforms and topics
│   ├── App.tsx             # Main application component and platform config
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global styles with custom animations
├── dist/                   # Built files for production (generated)
├── helm/                   # Kubernetes Helm Charts
│   └── pulsehub/
│       ├── templates/      # Kubernetes deployment templates
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── ingress.yaml
│       ├── Chart.yaml      # Helm chart metadata
│       ├── values.yaml     # Default configuration values
│       └── README.md       # Helm deployment documentation
├── package.json            # Dependencies and npm scripts
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Multi-stage Docker build file
└── README.md               # This documentation
```

## 🔧 Configuration

### Vite Configuration

Main configuration in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
```

### Tailwind CSS Configuration

Main configuration in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

## 📊 Supported Data Sources

- **Weibo Hot Search** - Real-time trending topics from China's largest microblogging platform
- **Douyin Hot List** - Short video platform hotspots and viral content
- **Bilibili Hot List** - Video platform popular content and trending topics
- **Zhihu Hot List** - Knowledge Q&A platform trending discussions
- **Baidu Hot Search** - Search engine trending queries and topics
- **Toutiao Hot List** - News and information platform trending articles
- **Aggregated Hot Topics** - Cross-platform trending topics that appear on multiple platforms

## 🛠️ Development Guide

### Adding New Data Sources

1. **Update API Service**
```typescript
// src/services/api.ts
static async fetchPlatformData(platform: string): Promise<PlatformResponse> {
  const endpointMap: Record<string, string> = {
    // ... existing endpoints
    newplatform: '/v2/newplatform',  // Add new endpoint
  };
  
  const endpoint = endpointMap[platform];
  if (!endpoint) {
    throw new Error(`Platform ${platform} is not supported by the API`);
  }
  
  const data = await this.fetchFrom60sAPI(endpoint);
  return this.transformData(platform, data);
}
```

2. **Update Platform Configuration**
```typescript
// src/App.tsx
const PLATFORM_CONFIG = [
  // ... existing configuration
  {
    platform: 'newplatform',
    displayName: 'New Platform Hot List',
    icon: 'N',
    color: '#ff6b35'
  }
];
```

3. **Update URL Template**
```typescript
// src/services/api.ts
const urlTemplates: Record<string, string> = {
  // ... existing templates
  newplatform: 'https://newplatform.com/search?q={query}',
};
```

### Custom Styling

The project uses Tailwind CSS, you can customize styles by modifying `src/index.css`:

```css
/* Custom card styles */
.custom-card {
  @apply rounded-2xl shadow-xl border border-white/20;
  @apply hover:shadow-2xl hover:scale-105 transition-all duration-500;
}
```

## 🚀 Deployment Options

### Kubernetes Deployment with Helm

PulseHub includes a complete Helm chart for Kubernetes deployment with the following features:

#### Prerequisites
- Kubernetes cluster (1.19+)
- Helm 3.x
- Nginx Ingress Controller
- cert-manager (for TLS certificates)
- external-dns (for DNS management)
- ArgoCD (for GitOps deployment)

#### Ingress Annotations
The Helm chart includes comprehensive annotations for external access:

```yaml
annotations:
  # Nginx Ingress Controller
  nginx.ingress.kubernetes.io/ssl-redirect: "true"
  nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
  nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
  nginx.ingress.kubernetes.io/proxy-body-size: "1m"
  nginx.ingress.kubernetes.io/enable-cors: "true"
  nginx.ingress.kubernetes.io/cors-allow-origin: "*"
  
  # External DNS for Cloudflare Tunnel
  external-dns.alpha.kubernetes.io/target: "homelab-tunnel.fullstackjam.com"
  external-dns.alpha.kubernetes.io/cloudflare-proxied: "true"
  
  # Certificate management
  cert-manager.io/cluster-issuer: "letsencrypt-prod"
  
  # ArgoCD sync
  argocd.argoproj.io/sync-wave: "1"
```

#### Deployment Commands
```bash
# Install with Helm
helm install pulsehub ./helm/pulsehub --namespace pulsehub --create-namespace

# Upgrade deployment
helm upgrade pulsehub ./helm/pulsehub --namespace pulsehub

# Uninstall
helm uninstall pulsehub --namespace pulsehub
```

### Static Hosting Services

- **Vercel** - One-click deployment from GitHub
- **Netlify** - Drag and drop deployment or Git integration
- **GitHub Pages** - Free hosting for public repositories
- **Cloudflare Pages** - Fast global CDN
- **Firebase Hosting** - Google's hosting platform

## 📝 Changelog

### v2.0.0 (Current)
- 🚀 **Pure Frontend Architecture** - No backend dependency, direct API calls
- ⚡ **60s API Integration** - Real-time data from https://60s.viki.moe
- 🎯 **Simplified Deployment** - Deploy to any static hosting service
- 🔧 **Improved Performance** - Optimized build with Vite and code splitting
- 🛠️ **TypeScript Migration** - Full type safety and better development experience
- 🎨 **Enhanced UI** - Glassmorphism design with smooth animations
- 📊 **Cross-platform Analysis** - Aggregated hot topics across multiple platforms
- 🖱️ **Drag & Drop Interface** - Intuitive platform card reordering
- 🔄 **Independent Refresh** - Per-platform data refresh functionality

### Key Features
- React 18 with TypeScript
- Vite build system for fast development and optimized production builds
- Tailwind CSS for responsive design
- Docker containerization with multi-stage builds
- Kubernetes Helm chart for production deployment
- CORS-enabled API integration
- Smart URL generation for each platform
- Responsive design for all device sizes

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Authors

- **fullstackjam** - *Initial development* - [GitHub](https://github.com/fullstackjam)

## 🙏 Acknowledgments

- Thanks to all contributors of open source projects
- Thanks to all platforms for providing public APIs
- Thanks to the community for support and feedback

---

**PulseHub** - Making hot topics accessible 🔥
