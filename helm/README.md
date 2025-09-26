# PulseHub Helm Chart

Minimal Kubernetes deployment configuration with all values fixed, no complex setup required.

## Quick Start

### Install
```bash
helm install pulsehub ./pulsehub
```

### Scale replicas
```bash
helm install pulsehub ./pulsehub \
  --set replicaCount=3
```

### Use different image
```bash
helm install pulsehub ./pulsehub \
  --set image.tag=v1.0.0
```

### Custom domain
```bash
helm install pulsehub ./pulsehub \
  --set ingress.host=your-domain.com
```

## Included Resources

- **Deployment**: PulseHub application (1 replica by default)
- **Service**: Routes traffic to Pods
- **Ingress**: External access entry point (pulsehub.fullstackjam.com)

## Fixed Configuration

- **Application Name**: `pulsehub`
- **Port**: `80`

## Configurable Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| `replicaCount` | `1` | Number of Pod replicas |
| `image.repository` | `fullstackjam/pulsehub` | Image repository |
| `image.tag` | `latest` | Image tag |
| `ingress.host` | `pulsehub.fullstackjam.com` | Access domain |

## Uninstall

```bash
helm uninstall pulsehub
```
