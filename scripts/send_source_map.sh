#!/usr/bin/env bash

export SENTRY_AUTH_TOKEN=b2969cb64a6245e7b8968e3a71d2be9ce75f62846ad44d019bfa06801cb49439
export SENTRY_ORG=tripeverywhere
export SENTRY_PROJECT=react
VERSION=$(sentry-cli releases propose-version)

pwd
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"
pwd

sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT files $VERSION upload-sourcemaps ./../dist/