# PulseHub Helm Chart

This is a Helm Chart for deploying the PulseHub application.

## Installation

### Direct Installation with Helm

```bash
helm install pulsehub ./helm/pulsehub \
  --namespace plusehub \
  --create-namespace
```

### Installation with ArgoCD

Create an Application in ArgoCD pointing to this repository:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: plusehub
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

## Configuration

### Main Configuration Items

- `replicaCount`: Number of replicas
- `image.repository`: Image repository
- `image.tag`: Image tag
- `service.port`: Service port
- `ingress.enabled`: Whether to enable Ingress
- `ingress.hosts`: Ingress host configuration
- `resources`: Resource limits and requests

### Custom Configuration

You can customize the configuration through values.yaml file or command line parameters:

```bash
helm install pulsehub ./helm/pulsehub \
  --set image.tag=v1.0.0 \
  --set replicaCount=2 \
  --set ingress.hosts[0].host=myapp.example.com
```

## Features

- Support for multi-replica deployment
- Automatic resource management
- Flexible Ingress configuration
- Automatic TLS certificate management
- External DNS integration
- Complete label and selector support
