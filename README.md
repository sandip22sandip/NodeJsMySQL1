## Install the Node JS:-
sudo apt-get update
sudo apt-get install nodejs
nodejs -v

sudo apt-get update
sudo apt-get install npm
npm -v

npm install -g nodemon
-----------------------------------------
## Create Project Folder:-
mkdir my-app
cd my-app
npm init

## Install npm Packages:-
npm install --save express mysql body-parser

npm uninstall express-validator
npm install express-validator@5.3.0

## Create app.js:-
touch app.js

## Generate Swagger Doc
npm run swagger-autogen