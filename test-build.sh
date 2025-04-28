#!/bin/bash
set -e

echo "Building Docker image for testing..."
docker build -t actota-front-test .

echo "Running container to test the build..."
docker run -it --rm -p 8080:8080 actota-front-test

echo "If you see this message, the container exited. Check the logs above for errors."