#!/bin/sh

source .env
read -p "Sentry DSN " VITE_SENTRY_DSN
npm run build
