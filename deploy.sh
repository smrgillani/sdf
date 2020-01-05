#!/usr/bin/env bash

nvm use

echo 'Pull repo changes'
git checkout small-develop
git pull

echo 'Install NPM dependencies'
rm -rf node_modules
npm install
git reset --hard

echo 'Build production statics'
rm -rf dist
npm run build-prod

echo 'Copy statics to target location'
rm -rf static
mv dist static

echo 'Deployment ended successfully'
