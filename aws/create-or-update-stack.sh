#!/bin/bash
set -e

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

STACK_NAME="la-crosse-to-wunderground-pws"
CODE_S3_BUCKET="[your s3 bucket]"
ALARM_EMAIL="[your email address]"

CODE_FILENAME="$STACK_NAME-$(date +%FT%T).zip"

npm test

pushd "$THIS_DIR"
rm -rf dist
mkdir -p dist
pushd dist
cp ../lambda.js .
cp ../../package.json .
cp -r ../../lib .
NODE_ENV=production npm install
rm -r package.json node_modules/*/{README.md,test*,bower.json,LICENSE}
zip -qr code.zip .
popd

aws s3 cp "$THIS_DIR/dist/code.zip" "s3://$CODE_S3_BUCKET/$CODE_FILENAME"

ACTION="update"
aws cloudformation describe-stacks --stack-name "$STACK_NAME" || ACTION="create"

aws cloudformation "$ACTION-stack" \
  --stack-name "$STACK_NAME" \
  --template-body "file://$THIS_DIR/cloudformation-template.yaml" \
  --capabilities "CAPABILITY_NAMED_IAM" \
  --parameters \
    "ParameterKey=AlarmEmail,ParameterValue=$ALARM_EMAIL" \
    "ParameterKey=CodeS3Bucket,ParameterValue=$CODE_S3_BUCKET" \
    "ParameterKey=CodeS3Key,ParameterValue=$CODE_FILENAME" \
    "ParameterKey=LaCrosseDeviceId,ParameterValue=$LA_CROSSE_DEVICE_ID" \
    "ParameterKey=WundergroundId,ParameterValue=$WUNDERGROUND_ID" \
    "ParameterKey=WundergroundPassword,ParameterValue=$WUNDERGROUND_PWD"

aws cloudformation wait "stack-$ACTION-complete" --stack-name "$STACK_NAME"

echo "Done!"
