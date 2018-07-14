#!/bin/bash
set -e

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

STACK_NAME="la-crosse-to-wunderground-pws"
CODE_S3_BUCKET="[your s3 bucket]"
ALARM_EMAIL="[your email address]"
REGION="us-west-2"

# Run tests
npm test

# Clean dist
rm -rf "$THIS_DIR/../dist"

# Build a lambda deployment ZIP package
pushd "$THIS_DIR/../"
npm run build
pushd "$THIS_DIR/../dist"
cp "$THIS_DIR/../package.json" .
cp "$THIS_DIR/../package-lock.json" .
npm ci --production || npm install --production
rm -fr package{,-lock}.json node_modules/*/{README.md,test*,bower.json,LICENSE}
hash="$(find . -type f -print0 | xargs -0 shasum | shasum | cut -d " " -f1)"
zip -X --quiet --recurse-paths code.zip .
popd

# Upload it to S3
code_filename_local="$THIS_DIR/../dist/code.zip"
code_filename_s3="$STACK_NAME-$hash.zip"
aws s3 ls "s3://$CODE_S3_BUCKET/$code_filename_s3" || \
  aws s3 cp "$code_filename_local" "s3://$CODE_S3_BUCKET/$code_filename_s3"

# Determine whether to create or update statck
ACTION="update"
aws cloudformation describe-stacks \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  > /dev/null || ACTION="create"

# Create or update statck
aws cloudformation "$ACTION-stack" \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --template-body "file://$THIS_DIR/cloudformation-template.yaml" \
  --capabilities "CAPABILITY_NAMED_IAM" \
  --parameters \
    "ParameterKey=AlarmEmail,ParameterValue=$ALARM_EMAIL" \
    "ParameterKey=CodeS3Bucket,ParameterValue=$CODE_S3_BUCKET" \
    "ParameterKey=CodeS3Key,ParameterValue=$code_filename_s3" \
    "ParameterKey=LaCrosseDeviceId,ParameterValue=$LA_CROSSE_DEVICE_ID" \
    "ParameterKey=WundergroundId,ParameterValue=$WUNDERGROUND_ID" \
    "ParameterKey=WundergroundPassword,ParameterValue=$WUNDERGROUND_PWD"