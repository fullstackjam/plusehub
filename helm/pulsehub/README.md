# PulseHub Helm Chart

这是一个用于部署 PulseHub 应用的 Helm Chart。

## 安装

### 使用 Helm 直接安装

```bash
helm install pulsehub ./helm/pulsehub \
  --namespace plusehub \
  --create-namespace
```

### 使用 ArgoCD 安装

在 ArgoCD 中创建一个 Application，指向这个仓库：

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: plusehub-custom
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/fullstackjam/plusehub
    targetRevision: master
    path: helm/pulsehub
  destination:
    server: https://kubernetes.default.svc
    namespace: plusehub
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## 配置

### 主要配置项

- `replicaCount`: 副本数量
- `image.repository`: 镜像仓库
- `image.tag`: 镜像标签
- `service.port`: 服务端口
- `ingress.enabled`: 是否启用 Ingress
- `ingress.hosts`: Ingress 主机配置
- `resources`: 资源限制和请求

### 自定义配置

可以通过 values.yaml 文件或命令行参数来自定义配置：

```bash
helm install pulsehub ./helm/pulsehub \
  --set image.tag=v1.0.0 \
  --set replicaCount=2 \
  --set ingress.hosts[0].host=myapp.example.com
```

## 特性

- 支持多副本部署
- 自动资源管理
- 灵活的 Ingress 配置
- TLS 证书自动管理
- 外部 DNS 集成
- 完整的标签和选择器支持
