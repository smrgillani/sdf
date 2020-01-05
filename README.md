# Saffron

## Set-up environment

Main branch is `develop`. You should always make changes on your own branch and then merge changes to `develop` using PR on github.

### Clone repo
```bash
git clone git@github.com:batissamadian/saffron-dab.git
git checkout develop
```

### Install NVM
Using cURL:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

or using Wget:
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

### Install node
```bash
nvm install
```
There is some issue with building frontend using default configuration.
To fix this add following line to you .bashrc or .zshrc (or equivalent):
```bash
export NODE_OPTIONS=--max_old_space_size=4096
```

### Install dependencies
```bash
nvm use
NODE_ENV=dev npm install
```

## Run development server
```bash
nvm use
npm run-script debug
```
Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

You should have API server running on `http://localhost:8000/`.
You can get it on https://github.com/batissamadian/saffron-dab-backend

## Running unit tests (deprecated)

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests (deprecated)

Run `npm run-script e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deployment (deprecated)

To deploy `test` server run `git push heroku develop:master`.

To deploy `stage` server run `git push heroku-stage master`.

## Production deployment
You need to have access to AWS.

Log in to server by SSH:
```bash
ssh -i "saffronnewserver.pem" ubuntu@ec2-52-32-181-2.us-west-2.compute.amazonaws.com
```

Enter frontend directory:
```bash
cd /var/www/html/saffron-dab
```

If you have only changed the code you can fast pull and rebuild frontend using:
```bash
nvm use && git pull && npm run build-prod && rm -rf static && mv dist static
```

If you have changed dependencies you should run full deployment script:
```bash
./deploy.sh
```

## Set-up environment for Windows
Prerequisite:
- must have a write access on most part of the drive
- use powershell and run as administrator
- install nvm from https://github.com/coreybutler/nvm-windows/releases (choose setup.zip)

execute commands:
- git clone https://github.com/batissamadian/saffron-dab.git
- cd saffron-dab
- git checkout develop
- nvm use 10.16.0
- npm install -g win-node-env
- NODE_ENV=dev npm install
- npm install -g increase-memory-limit
- increase-memory-limit
- npm run-script debug
abc
