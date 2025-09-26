# PulseHub Helm Chart

This Helm chart deploys PulseHub on a Kubernetes cluster using the Helm package manager.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- NGINX Ingress Controller

## Installing the Chart

### Using Helm CLI

To install the chart with the release name `pulsehub`:

```bash
helm repo add fullstackjam https://charts.fullstackjam.com
helm install pulsehub fullstackjam/pulsehub
```

To install the chart from local files:

```bash
helm install pulsehub ./helm/pulsehub
```

### Using ArgoCD

Create an ArgoCD Application to deploy this chart:

```bash
kubectl apply -f argocd-application.yaml
```

The ArgoCD Application includes:
- **Image Updater**: Automatically updates the image tag to latest
- **Auto Sync**: Automatic pruning and self-healing
- **Namespace Creation**: Creates the `pulsehub` namespace automatically
- **Server-Side Apply**: Uses server-side apply for better conflict resolution

Or use the ArgoCD UI to create an application with the following configuration:
- **Repository URL**: `https://github.com/fullstackjam/pulsehub`
- **Path**: `helm/pulsehub`
- **Target Revision**: `master`
- **Destination**: `in-cluster` and namespace `pulsehub`

## Uninstalling the Chart

To uninstall/delete the `pulsehub` deployment:

```bash
helm uninstall pulsehub
```

## Configuration

The following table lists the configurable parameters and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Image repository | `fullstackjam/pulsehub` |
| `image.tag` | Image tag | `latest` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `nginx` |
| `ingress.hosts[0].host` | Ingress host | `pulsehub.fullstackjam.com` |
| `ingress.annotations` | Ingress annotations | See values.yaml for complete list |
| `ingress.tls` | TLS configuration | Auto-configured with cert-manager |
| `resources.limits.cpu` | CPU limit | `100m` |
| `resources.limits.memory` | Memory limit | `128Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |

## Examples

### Install with custom values

```bash
helm install pulsehub ./helm/pulsehub \
  --set image.tag=v1.0.0 \
  --set ingress.hosts[0].host=my-pulsehub.example.com \
  --set resources.limits.memory=256Mi
```

### Install with values file

```bash
helm install pulsehub ./helm/pulsehub -f my-values.yaml
```

## Ingress Annotations

This chart includes comprehensive nginx ingress annotations for production deployment:

### SSL/TLS Configuration
- `nginx.ingress.kubernetes.io/ssl-redirect: "true"` - Force HTTPS redirect
- `nginx.ingress.kubernetes.io/force-ssl-redirect: "true"` - Additional SSL enforcement
- `cert-manager.io/cluster-issuer: "letsencrypt-prod"` - Automatic TLS certificate

### CORS Configuration
- `nginx.ingress.kubernetes.io/enable-cors: "true"` - Enable CORS support
- `nginx.ingress.kubernetes.io/cors-allow-origin: "*"` - Allow all origins
- `nginx.ingress.kubernetes.io/cors-allow-methods` - Allowed HTTP methods
- `nginx.ingress.kubernetes.io/cors-allow-headers` - Allowed headers

### Proxy Configuration
- `nginx.ingress.kubernetes.io/proxy-body-size: "1m"` - Max request body size
- `nginx.ingress.kubernetes.io/proxy-connect-timeout: "60"` - Connection timeout
- `nginx.ingress.kubernetes.io/proxy-read-timeout: "60"` - Read timeout
- `nginx.ingress.kubernetes.io/proxy-send-timeout: "60"` - Send timeout

### ArgoCD Integration
- `argocd.argoproj.io/sync-wave: "1"` - ArgoCD sync ordering
