#!/bin/bash
STACK_NAME="la-crosse-to-wunderground-pws"
CODE_S3_BUCKET="[your s3 bucket]"

ZIP_FILENAME="$STACK_NAME-$(date +%FT%T).zip"

pushd lambda
rm -rf dist
mkdir -p dist
cp lambda.js dist
cp ../package.json dist
cp -r ../lib dist

pushd dist
NODE_ENV=production npm install
rm -r package.json node_modules/*/{README.md,test*,bower.json,LICENSE}
zip -qr code.zip .
popd

aws s3 cp dist/code.zip "s3://$CODE_S3_BUCKET/$ZIP_FILENAME"

popd

ACTION="create"
aws cloudformation describe-stacks --stack-name "$STACK_NAME" && \
  ACTION="update"

aws cloudformation "$ACTION-stack" \
  --stack-name "$STACK_NAME" \
  --template-body file://lambda/cloudformation-template.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
    "ParameterKey=StackName,ParameterValue=$STACK_NAME" \
    "ParameterKey=CodeS3Bucket,ParameterValue=$CODE_S3_BUCKET" \
    "ParameterKey=CodeObjectKey,ParameterValue=$ZIP_FILENAME" \
    "ParameterKey=LaCrosseDeviceId,ParameterValue=$LA_CROSSE_DEVICE_ID" \
    "ParameterKey=WundergroundId,ParameterValue=$WUNDERGROUND_ID" \
    "ParameterKey=WundergroundPassword,ParameterValue=$WUNDERGROUND_PASSWORD"

aws cloudformation wait "stack-$ACTION-complete" --stack-name "$STACK_NAME"

echo "Done!"
