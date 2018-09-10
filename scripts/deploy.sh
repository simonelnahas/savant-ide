#!/bin/bash

set -e

aws --version

[ -z ${TRAVIS_BUILD_DIR} ] && SCRIPT_DIR=./scripts || SCRIPT_DIR=${TRAVIS_BUILD_DIR}/scripts

echo 'Deploying client to S3...'
${SCRIPT_DIR}/deploy_client.sh

echo 'Building docker image...'
${SCRIPT_DIR}/deploy_docker.sh
