## Install the Node JS:-
- sudo apt-get update
- sudo apt-get install nodejs
- nodejs -v

- sudo apt-get update
- sudo apt-get install npm
- npm -v

- npm install -g nodemon

## Create Project Folder:-
- mkdir my-app
- cd my-app
- npm init

## Install npm Packages:-
- npm install --save express mysql body-parser

- npm uninstall express-validator
- npm install express-validator@5.3.0

## Create app.js:-
- touch app.js

## Generate Swagger Doc
- npm run swagger-autogen

## pm2 npm Package to Start the Node App/CRON Job:-
- npm install pm2 -g
- pm2 start app.js --name "Start App.js"
- pm2 logs
- pm2 list
- pm2 delete app.js
- pm2 delete all
- pm2 flush

## Create Migrations using db-migrate nmp Package:-
- npm install -g db-migrate
- npm install --save db-migrate-mysql
- db-migrate create user
- db-migrate up
- db-migrate down
- db-migrate up 20111219