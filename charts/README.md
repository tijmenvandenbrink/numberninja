# Number Ninja Helm Chart

Deploy Number Ninja, a gamified math practice web application for kids, on Kubernetes using Helm.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- NGINX Ingress Controller (if using ingress)

## Installing the Chart

To install the chart with the release name `numberninja`:

```bash
# Install from local chart
helm install numberninja ./charts/numberninja

# Install with custom values
helm install numberninja ./charts/numberninja -f my-values.yaml

# Install in specific namespace
helm install numberninja ./charts/numberninja -n numberninja --create-namespace
```

## Uninstalling the Chart

To uninstall/delete the `numberninja` deployment:

```bash
helm delete numberninja
```

## Configuration

The following table lists the configurable parameters and their default values.

### Global Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `nameOverride` | Override the name of the chart | `""` |
| `fullnameOverride` | Override the fullname of the chart | `""` |

### Image Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image.backend.repository` | Backend image repository | `numberninja/backend` |
| `image.backend.tag` | Backend image tag | `"latest"` |
| `image.backend.pullPolicy` | Backend image pull policy | `IfNotPresent` |
| `image.frontend.repository` | Frontend image repository | `numberninja/frontend` |
| `image.frontend.tag` | Frontend image tag | `"latest"` |
| `image.frontend.pullPolicy` | Frontend image pull policy | `IfNotPresent` |

### Service Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `service.type` | Kubernetes service type | `ClusterIP` |
| `service.backend.port` | Backend service port | `8000` |
| `service.frontend.port` | Frontend service port | `3000` |

### Ingress Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress controller resource | `true` |
| `ingress.className` | Ingress class name | `""` |
| `ingress.annotations` | Ingress annotations | `{}` |
| `ingress.hosts[0].host` | Default host for the ingress | `numberninja.local` |
| `ingress.tls` | Ingress TLS configuration | `[]` |

### Resources

| Parameter | Description | Default |
|-----------|-------------|---------|
| `resources.backend.limits.cpu` | Backend CPU limit | `500m` |
| `resources.backend.limits.memory` | Backend memory limit | `512Mi` |
| `resources.backend.requests.cpu` | Backend CPU request | `250m` |
| `resources.backend.requests.memory` | Backend memory request | `256Mi` |
| `resources.frontend.limits.cpu` | Frontend CPU limit | `200m` |
| `resources.frontend.limits.memory` | Frontend memory limit | `256Mi` |
| `resources.frontend.requests.cpu` | Frontend CPU request | `100m` |
| `resources.frontend.requests.memory` | Frontend memory request | `128Mi` |

### Autoscaling

| Parameter | Description | Default |
|-----------|-------------|---------|
| `autoscaling.enabled` | Enable Horizontal Pod Autoscaler | `false` |
| `autoscaling.minReplicas` | Minimum replicas | `1` |
| `autoscaling.maxReplicas` | Maximum replicas | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | Target CPU utilization | `80` |

## Examples

### Basic Installation

```bash
helm install numberninja ./charts/numberninja
```

### Installation with Custom Domain

```yaml
# values-prod.yaml
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: numberninja.example.com
      paths:
        - path: /api
          pathType: Prefix
          service: backend
        - path: /
          pathType: Prefix
          service: frontend
  tls:
    - secretName: numberninja-tls
      hosts:
        - numberninja.example.com

frontend:
  env:
    VITE_API_URL: "https://numberninja.example.com/api"
```

```bash
helm install numberninja ./charts/numberninja -f values-prod.yaml
```

### High Availability Setup

```yaml
# values-ha.yaml
replicaCount: 3

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

resources:
  backend:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 500m
      memory: 512Mi
  frontend:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 200m
      memory: 256Mi

affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchLabels:
            app.kubernetes.io/name: numberninja
        topologyKey: kubernetes.io/hostname
```

```bash
helm install numberninja ./charts/numberninja -f values-ha.yaml
```

### Local Development

```bash
# Install with port-forward access
helm install numberninja ./charts/numberninja --set ingress.enabled=false

# Forward ports
kubectl port-forward svc/numberninja-frontend 3000:3000 &
kubectl port-forward svc/numberninja-backend 8000:8000 &

# Access the application
open http://localhost:3000
```

## Monitoring

### Health Checks

The chart includes health checks for both services:

- Backend: `GET /health`
- Frontend: `GET /`

### Viewing Logs

```bash
# Backend logs
kubectl logs -l app.kubernetes.io/component=backend -c backend

# Frontend logs  
kubectl logs -l app.kubernetes.io/component=frontend -c frontend

# Follow logs
kubectl logs -l app.kubernetes.io/name=numberninja -f
```

### Debugging

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=numberninja

# Describe pods
kubectl describe pods -l app.kubernetes.io/name=numberninja

# Check services
kubectl get svc -l app.kubernetes.io/name=numberninja

# Check ingress
kubectl get ingress numberninja
```

## Upgrading

To upgrade an existing installation:

```bash
helm upgrade numberninja ./charts/numberninja
```

## Troubleshooting

### Common Issues

1. **Ingress not working**: Ensure NGINX ingress controller is installed
2. **Images not pulling**: Check image repository and credentials
3. **Frontend can't reach backend**: Verify `VITE_API_URL` environment variable
4. **Pods not starting**: Check resource limits and node capacity

### Support

For issues related to the Helm chart, please check the logs and pod status. For application-specific issues, refer to the main project documentation.