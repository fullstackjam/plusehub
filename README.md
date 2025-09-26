# PulseHub - Social Media Hot Topics Aggregation Platform

PulseHub is a modern social media hot topics aggregation platform that collects and displays trending topics from multiple platforms in real-time, including Weibo, Douyin, Bilibili, Zhihu and other mainstream social media platforms.

## ✨ Features

- 🔥 **Real-time Hot Topics Aggregation** - Collect trending topics from 10+ mainstream platforms
- 🎨 **Modern UI Design** - Features glassmorphism and gradient design
- 🖱️ **Drag & Drop Sorting** - Support card drag and drop reordering
- 🔄 **Independent Refresh** - Each platform can refresh data independently
- 📱 **Responsive Design** - Perfect adaptation to various devices
- 🚀 **One-click Deployment** - Support Docker and Kubernetes deployment

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Atomic CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client

### Deployment
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Helm** - Package management
- **Nginx Ingress** - Load balancing

## 🚀 Quick Start

### Requirements

- Node.js 18+
- Docker 20+
- Kubernetes 1.20+
- Helm 3.0+

### Local Development

1. **Clone the project**
```bash
git clone https://github.com/fullstackjam/pulsehub.git
cd pulsehub
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

3. **Start development servers**
```bash
# Start backend (port 3001)
cd backend && npm run dev

# Start frontend (port 5173)
cd frontend && npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Docker Deployment

1. **Build image**
```bash
docker build -t pulsehub .
```

2. **Run container**
```bash
# Run in foreground
docker run -p 3001:3001 pulsehub

# Run in background
docker run -d -p 3001:3001 --name pulsehub pulsehub
```

3. **Access the application**
- Application URL: http://localhost:3001

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
├── frontend/                 # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── services/       # Business logic services
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Application entry point
│   └── package.json
├── helm/                   # Helm Charts
│   └── pulsehub/
│       ├── templates/      # Kubernetes templates
│       ├── Chart.yaml      # Chart metadata
│       └── values.yaml     # Configuration values
├── .github/                # GitHub Actions
│   └── workflows/
├── Dockerfile              # Docker build file
└── package.json           # Root dependencies
```

## 🔧 Configuration

### Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `PORT` | `3001` | Backend service port |
| `NODE_ENV` | `development` | Runtime environment |

### Helm Configuration

Main configuration items in `helm/pulsehub/values.yaml`:

```yaml
replicaCount: 1                    # Number of replicas
image:
  repository: fullstackjam/pulsehub # Image repository
  tag: latest                      # Image tag
ingress:
  enabled: true                    # Enable Ingress
  hosts:
    - host: pulsehub.fullstackjam.com # Domain name
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

1. **Backend API Service**
```typescript
// backend/src/services/api.ts
static async getNewPlatformHot(): Promise<HotTopic[]> {
  // Implement data fetching logic
  return topics;
}
```

2. **Frontend Configuration**
```typescript
// frontend/src/App.tsx
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

The project uses Tailwind CSS, you can customize styles by modifying `frontend/src/index.css`:

```css
/* Custom card styles */
.custom-card {
  @apply rounded-2xl shadow-xl border border-white/20;
  @apply hover:shadow-2xl hover:scale-105 transition-all duration-500;
}
```

## 🚀 CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline** - Code checking, type checking, build testing
- **Docker Build** - Automatic build and push to Docker Hub
- **Kubernetes Deployment** - Automatic deployment to K8s cluster

## 📝 Changelog

### v1.0.0 (2024-09-26)
- ✨ Initial version release
- 🔥 Support for 10+ platform hot topic aggregation
- 🎨 Modern UI design
- 🖱️ Drag and drop sorting functionality
- 🔄 Independent refresh functionality
- 🚀 Docker and Kubernetes deployment support

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
