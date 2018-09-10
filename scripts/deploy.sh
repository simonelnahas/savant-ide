#!/bin/bash

set -e

echo "Deploying client bundle to s3..."
./deploy_client.sh

echo "Building docker image and pushing to ECR..."
./deploy_docker.sh
