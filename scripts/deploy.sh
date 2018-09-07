#!/bin/bash

set -e

aws --version

cd build

region_id=us-west-2
bucket=scillaide
files=($(find *))

echo "Emptying bucket..."
aws --region ${region_id} s3 rm s3://${bucket}

for file in "${files[@]}"
do
  if [ -d ${file} ]; then
    continue
  else
    aws s3 cp ${file} s3://${bucket}/${file}
  fi
done

echo "Done"
