STAGE=${1:-dev}
yarn build
NODE_ENV=$STAGE sls deploy --stage $STAGE