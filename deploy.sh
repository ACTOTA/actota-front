#!/bin/bash
set -e

# Configuration
PROJECT_ID="actota"
SERVICE_NAME="actota-frontend"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is required but not installed."
    echo "Please install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one with required variables."
    exit 1
fi

# Load environment variables from .env file
ENV_VARS=$(grep -v '^#' .env | xargs | tr ' ' ',')

# Extract all NEXT_PUBLIC environment variables for build args
BUILD_ARGS=""
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ $key == \#* ]] || [ -z "$key" ] && continue
    
    # Only process NEXT_PUBLIC variables
    if [[ $key == NEXT_PUBLIC_* ]]; then
        # Escape any quotes in the value
        value=$(echo "$value" | sed 's/"/\\"/g')
        BUILD_ARGS="$BUILD_ARGS --build-arg $key=\"$value\""
    fi
done < .env

echo "Building Docker image with environment variables..."
echo "Build arguments: $BUILD_ARGS"

# Build the Docker image with environment variables
eval "docker buildx build --platform linux/amd64 --no-cache \
  $BUILD_ARGS \
  --tag ${IMAGE_NAME}:amd64 \
  --push \
  ."

# Push the image to Google Container Registry
echo "Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run with environment variables
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "$ENV_VARS" \
  --project $PROJECT_ID

echo "Deployment complete!"
echo "Your service is available at: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')"
