#!/bin/bash

# PulseHub Kubernetes Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
NAMESPACE="default"
RELEASE_NAME="pulsehub"
IMAGE_TAG="latest"
IMAGE_REPOSITORY="pulsehub"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists kubectl; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    if ! command_exists helm; then
        print_error "helm is not installed or not in PATH"
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "docker is not installed or not in PATH"
        exit 1
    fi
    
    print_success "All prerequisites are met"
}

# Function to build Docker image
build_image() {
    print_status "Building Docker image..."
    
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found in current directory"
        exit 1
    fi
    
    docker build -t ${IMAGE_REPOSITORY}:${IMAGE_TAG} .
    print_success "Docker image built successfully"
}

# Function to deploy with Helm
deploy_helm() {
    print_status "Deploying with Helm..."
    
    # Check if release already exists
    if helm list -n ${NAMESPACE} | grep -q ${RELEASE_NAME}; then
        print_warning "Release ${RELEASE_NAME} already exists. Upgrading..."
        helm upgrade ${RELEASE_NAME} ./helm/pulsehub \
            --namespace ${NAMESPACE} \
            --set image.repository=${IMAGE_REPOSITORY} \
            --set image.tag=${IMAGE_TAG} \
            --wait
    else
        print_status "Installing new release..."
        helm install ${RELEASE_NAME} ./helm/pulsehub \
            --namespace ${NAMESPACE} \
            --create-namespace \
            --set image.repository=${IMAGE_REPOSITORY} \
            --set image.tag=${IMAGE_TAG} \
            --wait
    fi
    
    print_success "Helm deployment completed"
}

# Function to check deployment status
check_deployment() {
    print_status "Checking deployment status..."
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE} --timeout=300s
    
    # Get pod status
    kubectl get pods -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE}
    
    # Get service status
    kubectl get svc -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE}
    
    print_success "Deployment status checked"
}

# Function to show access information
show_access_info() {
    print_status "Getting access information..."
    
    # Get service information
    SERVICE_TYPE=$(kubectl get svc ${RELEASE_NAME} -n ${NAMESPACE} -o jsonpath='{.spec.type}')
    
    case $SERVICE_TYPE in
        "ClusterIP")
            print_status "Service type: ClusterIP"
            print_status "To access the application, use port forwarding:"
            echo "kubectl port-forward svc/${RELEASE_NAME} 3001:80 -n ${NAMESPACE}"
            echo "Then open: http://localhost:3001"
            ;;
        "LoadBalancer")
            EXTERNAL_IP=$(kubectl get svc ${RELEASE_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
            if [ -n "$EXTERNAL_IP" ]; then
                print_success "Application is available at: http://${EXTERNAL_IP} or https://pulsehub.fullstackjam.com"
            else
                print_warning "LoadBalancer IP is not yet assigned. Check with: kubectl get svc ${RELEASE_NAME} -n ${NAMESPACE}"
            fi
            ;;
        "NodePort")
            NODE_PORT=$(kubectl get svc ${RELEASE_NAME} -n ${NAMESPACE} -o jsonpath='{.spec.ports[0].nodePort}')
            print_success "Application is available on any node at port: ${NODE_PORT}"
            ;;
    esac
}

# Function to show help
show_help() {
    echo "PulseHub Kubernetes Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --namespace NAMESPACE    Kubernetes namespace (default: default)"
    echo "  -r, --release RELEASE_NAME   Helm release name (default: pulsehub)"
    echo "  -t, --tag IMAGE_TAG          Docker image tag (default: latest)"
    echo "  -i, --image IMAGE_REPO       Docker image repository (default: pulsehub)"
    echo "  --no-build                   Skip Docker image build"
    echo "  --no-deploy                  Skip Helm deployment"
    echo "  -h, --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy with default settings"
    echo "  $0 -n pulsehub -t v1.0.0             # Deploy to pulsehub namespace with v1.0.0 tag"
    echo "  $0 --no-build                        # Skip building, only deploy"
    echo "  $0 --no-deploy                       # Only build image, don't deploy"
}

# Parse command line arguments
BUILD_IMAGE=true
DEPLOY_HELM=true

while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        -r|--release)
            RELEASE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -i|--image)
            IMAGE_REPOSITORY="$2"
            shift 2
            ;;
        --no-build)
            BUILD_IMAGE=false
            shift
            ;;
        --no-deploy)
            DEPLOY_HELM=false
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_status "Starting PulseHub deployment..."
    print_status "Namespace: ${NAMESPACE}"
    print_status "Release: ${RELEASE_NAME}"
    print_status "Image: ${IMAGE_REPOSITORY}:${IMAGE_TAG}"
    
    check_prerequisites
    
    if [ "$BUILD_IMAGE" = true ]; then
        build_image
    fi
    
    if [ "$DEPLOY_HELM" = true ]; then
        deploy_helm
        check_deployment
        show_access_info
    fi
    
    print_success "PulseHub deployment completed!"
}

# Run main function
main "$@"
