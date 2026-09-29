#!/bin/bash

read -p "Specify backend URL (leave empty for default (api.<frontend url>)) " backend_url

if [[ $backend_url != "" ]]; then
    VITE_GIT_REF=$(git rev-parse HEAD) VITE_BACKEND_URL=$backend_url npm run build
else
    VITE_GIT_REF=$(git rev-parse HEAD) npm run build
fi
