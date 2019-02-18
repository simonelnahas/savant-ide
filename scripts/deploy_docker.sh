#!/bin/bash

set -e

docker --version
aws --version

[ -z "$TRAVIS_BUILD_DIR" ] && DOCKER_DIR=. || DOCKER_DIR=$TRAVIS_BUILD_DIR
[[ -z "$TRAVIS_COMMIT" ]] && TRAVIS_COMMIT=HEAD
echo $TRAVIS_COMMIT
commit=$(git rev-parse --short=7 ${TRAVIS_COMMIT})
account_id=$(aws sts get-caller-identity --output text --query 'Account')
region_id=us-west-2
registry_url=${account_id}.dkr.ecr.${region_id}.amazonaws.com/scilla-runner-api
# ECS settings
cluster=scilla-runner-api
service=scilla-runner-api

echo "Building container..."
eval "$(aws ecr get-login --no-include-email --region $region_id)"
docker build -t "$registry_url:latest" -t "$registry_url:$commit" "$DOCKER_DIR"

echo "Pushing to ECR..."
docker push "$registry_url"

echo "Deploying to ECS..."
curl https://raw.githubusercontent.com/silinternational/ecs-deploy/master/ecs-deploy | sudo tee /usr/bin/ecs-deploy
sudo chmod +x /usr/bin/ecs-deploy

ecs-deploy -c $cluster -n $service -i "$registry_url:latest"
