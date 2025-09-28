# PulseHub Helm Chart

This Helm chart deploys PulseHub - a React-based social media hot topics aggregation platform - on a Kubernetes cluster using the Helm package manager.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- NGINX Ingress Controller
- cert-manager (for TLS certificates)
- external-dns (for DNS management - optional)

## Installing the Chart

### Using Helm CLI

To install the chart from local files:

```bash
# Create namespace
kubectl create namespace pulsehub

# Install the chart
helm install pulsehub ./helm/pulsehub --namespace pulsehub
```

To install with custom values:

```bash
helm install pulsehub ./helm/pulsehub \
  --namespace pulsehub \
  --set image.tag=v2.0.0 \
  --set ingress.host=my-pulsehub.example.com
```

### Using ArgoCD (GitOps)

Create an ArgoCD Application to deploy this chart using GitOps principles:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pulsehub
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/fullstackjam/pulsehub
    targetRevision: master
    path: helm/pulsehub
  destination:
    server: https://kubernetes.default.svc
    namespace: pulsehub
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

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
| `app.name` | Application name (used for labels and naming) | `pulsehub` |
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Docker image repository | `fullstackjam/pulsehub` |
| `image.tag` | Docker image tag | `latest` |
| `ingress.host` | Ingress hostname | `pulsehub.fullstackjam.com` |

### Default values.yaml

```yaml
# Application configuration
app:
  name: pulsehub

# Deployment configuration
replicaCount: 1

# Container image
image:
  repository: fullstackjam/pulsehub
  tag: latest

# Ingress configuration
ingress:
  host: pulsehub.fullstackjam.com
```

## Examples

### Install with custom values

```bash
helm install pulsehub ./helm/pulsehub \
  --set image.tag=v1.0.0 \
  --set ingress.host=my-pulsehub.example.com
```

### Install with values file

```bash
helm install pulsehub ./helm/pulsehub -f my-values.yaml
```

## Features

This chart includes production-ready configurations:

- **SSL/TLS**: Automatic HTTPS with Let's Encrypt certificates via cert-manager
- **External DNS**: Automatic DNS management for ingress (optional)
- **Resource Management**: CPU and memory limits configured for optimal performance
- **Health Checks**: Built-in container health checks via Dockerfile
- **GitOps Ready**: Optimized for ArgoCD deployment with automated sync
- **Namespace Isolation**: Deploys in dedicated namespace for security
- **Multi-stage Docker Build**: Optimized container image with nginx serving
- **Ingress Annotations**: Comprehensive annotations for external access

## Ingress Configuration

The chart includes comprehensive ingress annotations for production deployment:

```yaml
annotations:
  # Certificate management
  cert-manager.io/cluster-issuer: "letsencrypt-prod"
  
  # External DNS for Cloudflare Tunnel
  external-dns.alpha.kubernetes.io/target: "homelab-tunnel.fullstackjam.com"
  external-dns.alpha.kubernetes.io/cloudflare-proxied: "true"
  
  # ArgoCD sync
  argocd.argoproj.io/sync-wave: "1"
```

## Troubleshooting

### Check deployment status
```bash
kubectl get pods -n pulsehub
kubectl get ingress -n pulsehub
kubectl describe pod <pod-name> -n pulsehub
```

### View logs
```bash
kubectl logs -f deployment/pulsehub -n pulsehub
```

### Test connectivity
```bash
# Test internal service
kubectl port-forward svc/pulsehub 8080:80 -n pulsehub
curl http://localhost:8080/health
```
