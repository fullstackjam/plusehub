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
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.host` | Ingress hostname | `pulsehub.fullstackjam.com` |

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

- **SSL/TLS**: Automatic HTTPS with Let's Encrypt certificates
- **CORS**: Cross-origin resource sharing enabled
- **Health Checks**: Liveness and readiness probes
- **Resource Limits**: CPU and memory limits configured
- **ArgoCD Ready**: Optimized for GitOps deployment
- **Image Updates**: Automatic image updates via ArgoCD Image Updater
