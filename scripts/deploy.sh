#!/bin/bash

set -e

aws --version

cd build

region_id=us-west-2
bucket=scillaide
files=($(find *))

echo "Emptying bucket..."
eval $(aws s3 --region ${region} rm s3://${bucket} --recursive)

for file in "${files[@]}"
do
  echo "Uploading ${file} to s3"
  eval $(aws s3 cp ${file} s3://${bucket}/${file})
done

echo "Done"
