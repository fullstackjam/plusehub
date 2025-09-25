# PulseHub

PulseHub 是一个聚合各大社交媒体平台实时热点榜单的Web应用。用户可以在一个统一的页面上快速浏览来自微博、抖音、哔哩哔哩、知乎、百度等平台的热搜内容。

## 功能特性

- 🔥 实时热点聚合：支持微博、抖音、哔哩哔哩、知乎、百度等平台
- 📱 响应式设计：适配各种屏幕尺寸
- ⚡ 快速加载：内置缓存机制，减少API请求
- 🎨 现代化UI：使用Tailwind CSS构建的美观界面
- 🔗 一键跳转：点击热点关键词直接跳转到对应平台搜索

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式框架
- 响应式网格布局

### 后端
- Node.js + Express
- TypeScript
- 内存缓存机制
- 60s API 数据源

## 项目结构

```
PulseHub/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── routes/         # API路由
│   │   ├── services/       # 服务层
│   │   └── index.ts        # 入口文件
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── services/       # API服务
│   │   ├── types/          # TypeScript类型
│   │   └── App.tsx         # 主应用组件
│   ├── package.json
│   └── vite.config.ts
├── package.json            # 根目录配置
└── README.md
```

## 快速开始

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 安装依赖

```bash
# 安装所有依赖（包括前端和后端）
npm run install:all
```

### 开发模式

```bash
# 同时启动前端和后端开发服务器
npm run dev
```

这将启动：
- 后端服务器：http://localhost:3001
- 前端应用：http://localhost:3000

### 单独运行

```bash
# 只运行后端
npm run dev:backend

# 只运行前端
npm run dev:frontend
```

### 生产构建

```bash
# 构建所有项目
npm run build

# 启动生产服务器
npm start
```

## API 端点

后端提供以下API端点：

- `GET /api/weibo` - 微博热搜
- `GET /api/douyin` - 抖音热榜
- `GET /api/bilibili` - 哔哩哔哩热榜
- `GET /api/zhihu` - 知乎热榜
- `GET /api/baidu` - 百度热搜
- `GET /api/health` - 健康检查

## 缓存机制

- 内存缓存：30分钟过期时间
- 自动清理：定期清理过期数据
- 错误处理：API失败时返回缓存数据

## 开发说明

### 后端开发

1. 修改 `backend/src/routes/` 中的路由文件
2. 在 `backend/src/services/` 中添加新的服务
3. 使用 `npm run dev:backend` 启动开发服务器

### 前端开发

1. 修改 `frontend/src/components/` 中的组件
2. 在 `frontend/src/services/` 中修改API调用
3. 使用 `npm run dev:frontend` 启动开发服务器

### 添加新平台

1. 在 `backend/src/routes/` 中创建新的路由文件
2. 在 `backend/src/services/api.ts` 中添加API方法
3. 在 `frontend/src/App.tsx` 的 `PLATFORM_CONFIG` 中添加平台配置

## 部署

### 本地开发部署

```bash
# 后端部署
cd backend
npm run build
npm start

# 前端部署
cd frontend
npm run build
# 将 dist 目录部署到静态文件服务器
```

### Docker 部署

#### 使用 Docker Compose（推荐）

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 使用 Docker 命令

```bash
# 构建镜像
docker build -t pulsehub:latest .

# 运行容器
docker run -p 3001:3001 pulsehub:latest
```

### Kubernetes 部署

#### 使用 Helm（推荐）

```bash
# 快速部署
./deploy.sh

# 自定义部署
./deploy.sh -n pulsehub -t v1.0.0

# 查看帮助
./deploy.sh --help
```

#### 手动 Helm 部署

```bash
# 构建 Docker 镜像
docker build -t pulsehub:latest .

# 安装 Helm Chart
helm install pulsehub ./helm/pulsehub

# 升级部署
helm upgrade pulsehub ./helm/pulsehub

# 卸载部署
helm uninstall pulsehub
```

#### 清理资源

```bash
# 清理 Kubernetes 资源
./cleanup.sh

# 清理包括 Docker 镜像
./cleanup.sh --cleanup-images
```

### 生产环境配置

#### 环境变量

```bash
NODE_ENV=production
PORT=3001
```

#### 资源配置

```yaml
# helm/pulsehub/values.yaml
resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

#### Ingress 配置

```yaml
ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: pulsehub.fullstackjam.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: pulsehub-tls
      hosts:
        - pulsehub.fullstackjam.com
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持5个主流社交媒体平台
- 响应式设计
- 缓存机制
