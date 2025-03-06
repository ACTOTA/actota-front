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

# Build the Docker image
echo "Building Docker image..."

docker buildx build --platform linux/amd64 \
  --tag ${IMAGE_NAME}:amd64 \
  --push \
  .

# Push the image to Google Container Registry
echo "Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "$(cat .env | grep -v '^#' | xargs | tr ' ' ',')" \
  --project $PROJECT_ID

echo "Deployment complete!"
echo "Your service is available at: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')"
