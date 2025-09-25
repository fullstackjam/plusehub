# PulseHub - 社交媒体热点聚合平台

PulseHub 是一个现代化的社交媒体热点聚合平台，实时收集和展示来自多个平台的热门话题，包括微博、抖音、B站、知乎等主流社交媒体平台。

## ✨ 特性

- 🔥 **实时热点聚合** - 收集10+主流平台的热门话题
- 🎨 **现代化UI设计** - 采用玻璃拟态和渐变设计
- 🖱️ **拖拽排序** - 支持卡片拖拽重新排序
- 🔄 **独立刷新** - 每个平台可单独刷新数据
- 📱 **响应式设计** - 完美适配各种设备
- 🚀 **一键部署** - 支持Docker和Kubernetes部署

## 🏗️ 技术栈

### 前端
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Tailwind CSS** - 原子化CSS框架

### 后端
- **Node.js** - 运行时环境
- **Express** - Web框架
- **TypeScript** - 类型安全
- **Axios** - HTTP客户端

### 部署
- **Docker** - 容器化
- **Kubernetes** - 容器编排
- **Helm** - 包管理
- **Nginx Ingress** - 负载均衡

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Docker 20+
- Kubernetes 1.20+
- Helm 3.0+

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/fullstackjam/plusehub.git
cd plusehub
```

2. **安装依赖**
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd ../backend && npm install
```

3. **启动开发服务器**
```bash
# 启动后端（端口3001）
cd backend && npm run dev

# 启动前端（端口5173）
cd frontend && npm run dev
```

4. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:3001/api

### Docker部署

1. **构建镜像**
```bash
docker build -t pulsehub .
```

2. **运行容器**
```bash
# 前台运行
docker run -p 3001:3001 pulsehub

# 后台运行
docker run -d -p 3001:3001 --name pulsehub pulsehub
```

3. **访问应用**
- 应用地址: http://localhost:3001

### Kubernetes部署

1. **使用Helm部署**
```bash
# 创建命名空间
kubectl create namespace plusehub

# 部署应用
helm install plusehub ./helm/pulsehub -n plusehub

# 查看部署状态
kubectl get pods -n plusehub
```

2. **访问应用**
- 应用地址: https://plusehub.fullstackjam.com

## 📁 项目结构

```
PulseHub/
├── frontend/                 # 前端React应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── services/        # API服务
│   │   ├── types/          # TypeScript类型定义
│   │   └── App.tsx         # 主应用组件
│   ├── public/             # 静态资源
│   └── package.json
├── backend/                 # 后端Node.js应用
│   ├── src/
│   │   ├── services/       # 业务逻辑服务
│   │   ├── routes/         # API路由
│   │   └── index.ts        # 应用入口
│   └── package.json
├── helm/                   # Helm Charts
│   └── pulsehub/
│       ├── templates/      # Kubernetes模板
│       ├── Chart.yaml      # Chart元数据
│       └── values.yaml     # 配置值
├── .github/                # GitHub Actions
│   └── workflows/
├── Dockerfile              # Docker构建文件
└── package.json           # 根目录依赖
```

## 🔧 配置说明

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | `3001` | 后端服务端口 |
| `NODE_ENV` | `development` | 运行环境 |

### Helm配置

主要配置项在 `helm/pulsehub/values.yaml`:

```yaml
replicaCount: 1                    # 副本数量
image:
  repository: fullstackjam/plusehub # 镜像仓库
  tag: latest                      # 镜像标签
ingress:
  enabled: true                    # 启用Ingress
  hosts:
    - host: plusehub.fullstackjam.com # 域名
```

## 📊 支持的数据源

- **微博热搜** - 实时热门话题
- **抖音热榜** - 短视频平台热点
- **B站热榜** - 视频平台热门内容
- **知乎热榜** - 知识问答平台热点
- **百度热搜** - 搜索引擎热点
- **今日头条** - 新闻资讯热点
- **36氪热榜** - 科技创投热点
- **虎嗅热文** - 商业科技资讯
- **豆瓣热榜** - 文化娱乐热点
- **虎扑热榜** - 体育社区热点

## 🛠️ 开发指南

### 添加新的数据源

1. **后端API服务**
```typescript
// backend/src/services/api.ts
static async getNewPlatformHot(): Promise<HotTopic[]> {
  // 实现数据获取逻辑
  return topics;
}
```

2. **前端配置**
```typescript
// frontend/src/App.tsx
const PLATFORM_CONFIG = [
  // ... 现有配置
  {
    platform: 'newplatform',
    displayName: '新平台热榜',
    icon: '新',
    color: '#ff6b35'
  }
];
```

### 自定义样式

项目使用Tailwind CSS，可以通过修改 `frontend/src/index.css` 来自定义样式：

```css
/* 自定义卡片样式 */
.custom-card {
  @apply rounded-2xl shadow-xl border border-white/20;
  @apply hover:shadow-2xl hover:scale-105 transition-all duration-500;
}
```

## 🚀 CI/CD

项目使用GitHub Actions进行持续集成和部署：

- **CI流程** - 代码检查、类型检查、构建测试
- **Docker构建** - 自动构建并推送到Docker Hub
- **Kubernetes部署** - 自动部署到K8s集群

## 📝 更新日志

### v1.0.0 (2024-09-26)
- ✨ 初始版本发布
- 🔥 支持10+平台热点聚合
- 🎨 现代化UI设计
- 🖱️ 拖拽排序功能
- 🔄 独立刷新功能
- 🚀 Docker和Kubernetes部署支持

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- **fullstackjam** - *初始开发* - [GitHub](https://github.com/fullstackjam)

## 🙏 致谢

- 感谢所有开源项目的贡献者
- 感谢各个平台提供的公开API
- 感谢社区的支持和反馈

---

**PulseHub** - 让热点信息触手可及 🔥
