# PulseHub Helm Chart

最小化的Kubernetes部署配置，只包含运行PulseHub所需的基本资源。

## 快速开始

### 1. 安装到默认命名空间
```bash
helm install pulsehub ./pulsehub
```

### 2. 安装到指定命名空间
```bash
helm install pulsehub ./pulsehub --namespace pulsehub --create-namespace
```

### 3. 自定义域名
```bash
helm install pulsehub ./pulsehub \
  --set ingress.host=your-domain.com
```

### 4. 扩展副本数量
```bash
helm install pulsehub ./pulsehub \
  --set replicaCount=3
```

## 包含的资源

- **Deployment**: 1个副本的PulseHub应用
- **Service**: 将流量路由到Pod
- **Ingress**: 外部访问入口（可选）

## 配置选项

| 参数 | 默认值 | 描述 |
|------|--------|------|
| `replicaCount` | `1` | Pod副本数量 |
| `image.repository` | `fullstackjam/pulsehub` | 镜像仓库 |
| `image.tag` | `latest` | 镜像标签 |
| `ingress.enabled` | `true` | 是否启用Ingress |
| `ingress.host` | `pulsehub.fullstackjam.com` | 访问域名 |

## 卸载

```bash
helm uninstall pulsehub
```
