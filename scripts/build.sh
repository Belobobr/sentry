#!/usr/bin/env bash

if [[ -z $(git status -s) ]]
then
    cross-env NODE_ENV=production
    cross-env RELEASE_VERSION=\"$(git rev-parse HEAD)\"
    webpack --config webpack.production.js
    npm run sentry_update_release
else
    echo "Uncommmited changes"
    exit
fi
