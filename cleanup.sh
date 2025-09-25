#!/bin/bash

# PulseHub Cleanup Script
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
CLEANUP_IMAGES=false

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

# Function to show help
show_help() {
    echo "PulseHub Cleanup Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --namespace NAMESPACE    Kubernetes namespace (default: default)"
    echo "  -r, --release RELEASE_NAME   Helm release name (default: pulsehub)"
    echo "  --cleanup-images             Also remove Docker images"
    echo "  -h, --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Cleanup with default settings"
    echo "  $0 -n pulsehub -r my-release         # Cleanup specific release in namespace"
    echo "  $0 --cleanup-images                  # Also remove Docker images"
}

# Parse command line arguments
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
        --cleanup-images)
            CLEANUP_IMAGES=true
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

# Function to cleanup Kubernetes resources
cleanup_k8s() {
    print_status "Cleaning up Kubernetes resources..."
    
    if ! command_exists kubectl; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    if ! command_exists helm; then
        print_error "helm is not installed or not in PATH"
        exit 1
    fi
    
    # Check if release exists
    if ! helm list -n ${NAMESPACE} | grep -q ${RELEASE_NAME}; then
        print_warning "Release ${RELEASE_NAME} not found in namespace ${NAMESPACE}"
    else
        print_status "Uninstalling Helm release: ${RELEASE_NAME}"
        helm uninstall ${RELEASE_NAME} -n ${NAMESPACE}
        print_success "Helm release uninstalled"
    fi
    
    # Clean up any remaining resources
    print_status "Cleaning up remaining resources..."
    
    # Delete any remaining pods
    kubectl delete pods -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE} --ignore-not-found=true
    
    # Delete any remaining services
    kubectl delete svc -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE} --ignore-not-found=true
    
    # Delete any remaining deployments
    kubectl delete deployment -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE} --ignore-not-found=true
    
    # Delete any remaining ingress
    kubectl delete ingress -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE} --ignore-not-found=true
    
    # Delete any remaining PVCs
    kubectl delete pvc -l app.kubernetes.io/name=pulsehub -n ${NAMESPACE} --ignore-not-found=true
    
    print_success "Kubernetes resources cleaned up"
}

# Function to cleanup Docker images
cleanup_docker() {
    if [ "$CLEANUP_IMAGES" = true ]; then
        print_status "Cleaning up Docker images..."
        
        if ! command_exists docker; then
            print_error "docker is not installed or not in PATH"
            exit 1
        fi
        
        # Remove pulsehub images
        print_status "Removing pulsehub Docker images..."
        docker images | grep pulsehub | awk '{print $3}' | xargs -r docker rmi -f
        
        # Remove dangling images
        print_status "Removing dangling images..."
        docker image prune -f
        
        print_success "Docker images cleaned up"
    fi
}

# Function to cleanup Docker Compose
cleanup_docker_compose() {
    print_status "Cleaning up Docker Compose..."
    
    if [ -f "docker-compose.yml" ]; then
        if command_exists docker-compose; then
            docker-compose down --volumes --remove-orphans
            print_success "Docker Compose cleaned up"
        else
            print_warning "docker-compose not found, skipping Docker Compose cleanup"
        fi
    else
        print_warning "docker-compose.yml not found, skipping Docker Compose cleanup"
    fi
}

# Main execution
main() {
    print_status "Starting PulseHub cleanup..."
    print_status "Namespace: ${NAMESPACE}"
    print_status "Release: ${RELEASE_NAME}"
    print_status "Cleanup images: ${CLEANUP_IMAGES}"
    
    cleanup_k8s
    cleanup_docker_compose
    cleanup_docker
    
    print_success "PulseHub cleanup completed!"
}

# Run main function
main "$@"
