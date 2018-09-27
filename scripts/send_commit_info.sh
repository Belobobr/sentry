#!/usr/bin/env bash

export SENTRY_AUTH_TOKEN=b2969cb64a6245e7b8968e3a71d2be9ce75f62846ad44d019bfa06801cb49439
export SENTRY_ORG=tripeverywhere
export SENTRY_PROJECT=react
VERSION=$(sentry-cli releases propose-version)

# Create a release
sentry-cli releases new -p $SENTRY_PROJECT $VERSION

# Associate commits with the release
sentry-cli releases set-commits --auto $VERSION


#sentry-cli releases deploys VERSION new -e ENVIRONMENT
