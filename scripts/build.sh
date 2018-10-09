#!/usr/bin/env bash

if [[ -z $(git status -s) ]]
then
    webpack --config webpack.production.js
    npm run sentry_update_release
else
    echo "Uncommmited changes"
    exit
fi
