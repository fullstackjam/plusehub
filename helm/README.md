# PulseHub Helm Chart

This Helm chart deploys PulseHub, a real-time trending topics aggregator, to a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Docker (for building images)

## Installation

### 1. Build Docker Image

```bash
# Build the Docker image
docker build -t pulsehub:latest .

# Tag for your registry (optional)
docker tag pulsehub:latest your-registry.com/pulsehub:latest
docker push your-registry.com/pulsehub:latest
```

### 2. Install with Helm

```bash
# Install the chart
helm install pulsehub ./helm/pulsehub

# Or with custom values
helm install pulsehub ./helm/pulsehub -f custom-values.yaml

# Or with specific values
helm install pulsehub ./helm/pulsehub \
  --set image.repository=your-registry.com/pulsehub \
  --set image.tag=latest \
  --set service.type=LoadBalancer
```

### 3. Verify Installation

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=pulsehub

# Check service
kubectl get svc pulsehub

# Check logs
kubectl logs -l app.kubernetes.io/name=pulsehub
```

## Configuration

### Key Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Image repository | `pulsehub` |
| `image.tag` | Image tag | `latest` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `ingress.enabled` | Enable ingress | `false` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |
| `autoscaling.enabled` | Enable HPA | `false` |

### Ingress Configuration

To enable ingress, set the following values:

```yaml
ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
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

### Resource Limits

```yaml
resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

### Horizontal Pod Autoscaling

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80
```

## Upgrading

```bash
# Upgrade the release
helm upgrade pulsehub ./helm/pulsehub

# Upgrade with new values
helm upgrade pulsehub ./helm/pulsehub -f new-values.yaml
```

## Uninstalling

```bash
# Uninstall the release
helm uninstall pulsehub
```

## Development

### Local Development with Docker Compose

```bash
# Start with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Testing the Helm Chart

```bash
# Dry run
helm install pulsehub ./helm/pulsehub --dry-run --debug

# Template rendering
helm template pulsehub ./helm/pulsehub

# Lint the chart
helm lint ./helm/pulsehub
```

## Monitoring

The application includes health check endpoints:

- Health check: `/api/health`
- All platforms: `/api/all`

You can configure monitoring using the `monitoring` section in values.yaml:

```yaml
monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    interval: 30s
    scrapeTimeout: 10s
```

## Troubleshooting

### Common Issues

1. **Pod not starting**: Check resource limits and node capacity
2. **Service not accessible**: Verify service type and ingress configuration
3. **Health check failing**: Ensure the application is properly built and the health endpoint is responding

### Debug Commands

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check service endpoints
kubectl get endpoints pulsehub

# Port forward for local testing
kubectl port-forward svc/pulsehub 3001:80
```

## Security

The chart includes security best practices:

- Non-root user (UID 1001)
- Read-only root filesystem (configurable)
- Security context configuration
- Resource limits and requests

## License

MIT
