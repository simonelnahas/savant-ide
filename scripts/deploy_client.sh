#!/bin/bash

set -e

aws --version


[ -z ${TRAVIS_BUILD_DIR} ] && BUILD_DIR=./build || BUILD_DIR=${TRAVIS_BUILD_DIR}/build

cd "${BUILD_DIR}"

region_id=us-west-2
bucket=savant-ide
files=($(find * ! -name "index.html" ! -name "service-worker.js" -type f))

echo "Emptying bucket..."
aws --region ${region_id} s3 rm s3://${bucket}

echo "Uploading files..."
for file in "${files[@]}"
do
  if [ -d ${file} ]; then
    continue
  else
    aws s3 cp ${file} s3://${bucket}/${file}
  fi
done

echo "Uploading index.html and service-worker.js"
aws s3 cp --cache-control max-age=0 "index.html" s3://${bucket}/index.html
aws s3 cp --cache-control max-age=0 "service-worker.js" s3://${bucket}/service-worker.js

echo "Done"
