#!/usr/bin/env bash
set -e

APP_NAME="$(cat package.json | jq -r '.name')"
READER_FUNCTION_NAME=$APP_NAME-reader
WRITER_FUNCTION_NAME=$APP_NAME-writer
REGION=us-east-1

THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm run test --if-present

npm run build
code_sha="$(openssl dgst -sha256 -binary $THIS_DIR/dist/function.zip | openssl enc -base64)"

bucket=mark-wainwright-cfn-assets-$REGION

# HACK!
reader_key=functions/$READER_FUNCTION_NAME/$code_sha.zip
if ! aws s3api head-object --bucket $bucket --key $reader_key > /dev/null
then
  aws s3 cp $THIS_DIR/dist/function.zip s3://$bucket/$reader_key
fi

writer_key=functions/$WRITER_FUNCTION_NAME/$code_sha.zip
if ! aws s3api head-object --bucket $bucket --key $writer_key > /dev/null
then
  aws s3 cp $THIS_DIR/dist/function.zip s3://$bucket/$writer_key
fi

FUNCTION_CODE_SHA=$code_sha \
  iidy create-or-update $THIS_DIR/infrastructure/stack-args.yml \
    --stack-name $APP_NAME \
    --region $REGION \
    --environment production
