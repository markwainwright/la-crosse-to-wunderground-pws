#!/bin/bash
set -e

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

STACK_NAME="la-crosse-to-wunderground-pws"
CODE_S3_BUCKET="[your s3 bucket]"
ALARM_EMAIL="[your email address]"
REGION="us-west-2"

npm test

pushd "$THIS_DIR"
rm -rf dist
mkdir -p dist
pushd dist
cp ../reader.js .
cp ../writer.js .
cp ../../package.json .
cp -r ../../lib .
NODE_ENV=production npm install
rm -fr package{,-lock}.json node_modules/*/{README.md,test*,bower.json,LICENSE}
hash="$(find . -type f -print0 | xargs -0 shasum | shasum | cut -d " " -f1)"
zip -X --quiet --recurse-paths code.zip .
popd

code_filename_local="$THIS_DIR/dist/code.zip"
code_filename_s3="$STACK_NAME-$hash.zip"

aws s3 ls "s3://$CODE_S3_BUCKET/$code_filename_s3" || \
  aws s3 cp "$code_filename_local" "s3://$CODE_S3_BUCKET/$code_filename_s3"

ACTION="update"
aws cloudformation describe-stacks \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  > /dev/null || ACTION="create"

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

aws cloudformation wait "stack-$ACTION-complete" --region "$REGION" --stack-name "$STACK_NAME"

echo "Done!"
