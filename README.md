# PulseHub - Social Media Hot Topics Aggregation Platform

PulseHub is a modern social media hot topics aggregation platform that collects and displays trending topics from multiple platforms in real-time, including Weibo, Douyin, Bilibili, Zhihu and other mainstream social media platforms.

## ✨ Features

- 🔥 **Real-time Hot Topics Aggregation** - Collect trending topics from 10+ mainstream platforms
- 🎨 **Modern UI Design** - Features glassmorphism and gradient design
- 🖱️ **Drag & Drop Sorting** - Support card drag and drop reordering
- 🔄 **Independent Refresh** - Each platform can refresh data independently
- 📱 **Responsive Design** - Perfect adaptation to various devices
- 🚀 **Pure Frontend** - No backend required, direct API calls from user's browser
- ⚡ **Fast Loading** - Direct data fetching for optimal performance

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Atomic CSS framework

### Data Sources
- **60s API** - Real-time hot topics from multiple platforms
- **Direct API Calls** - No proxy, using user's IP for requests

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
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

3. **Start development server**
```bash
# Start frontend development server
npm run dev
```

4. **Access the application**
- Application: http://localhost:3000

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
│   │   ├── Dashboard.tsx    # Main dashboard component
│   │   └── PlatformCard.tsx # Platform card component
│   ├── services/           # API services
│   │   └── api.ts          # Direct API calls to external services
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Type definitions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── dist/                   # Built files for production
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Docker build file
├── .dockerignore           # Docker ignore file
└── helm/                   # Helm Charts
    └── pulsehub/
        ├── templates/      # Kubernetes templates
        ├── Chart.yaml      # Chart metadata
        └── values.yaml     # Configuration values
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

- **Weibo Hot Search** - Real-time trending topics
- **Douyin Hot List** - Short video platform hotspots
- **Bilibili Hot List** - Video platform popular content
- **Zhihu Hot List** - Knowledge Q&A platform hotspots
- **Baidu Hot Search** - Search engine hotspots
- **Toutiao Hot List** - News and information hotspots
- **36Kr Hot List** - Technology and venture capital hotspots
- **Huxiu Hot Articles** - Business and technology news
- **Douban Hot List** - Culture and entertainment hotspots
- **Hupu Hot List** - Sports community hotspots

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
    return this.getMockData(platform);
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

### v2.0.0 (2024-09-26)
- 🚀 **Major Architecture Change** - Removed backend dependency
- ⚡ **Direct API Calls** - Frontend directly requests external APIs using user's IP
- 🎯 **Simplified Deployment** - Pure frontend application, deploy to any static hosting
- 🔧 **Improved Performance** - No server proxy, faster data loading
- 🛠️ **Easier Maintenance** - Single codebase, no backend to maintain

### v1.0.0 (2024-09-26)
- ✨ Initial version release
- 🔥 Support for 10+ platform hot topic aggregation
- 🎨 Modern UI design
- 🖱️ Drag and drop sorting functionality
- 🔄 Independent refresh functionality

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
