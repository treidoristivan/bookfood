
<h4 align="center"> Food Delivery APP </h4>


## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a> (Optional)
4. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Open CMD or Terminal and Type `npm run-script migrate`
6. open application In Browser (ex: localhost:3000/api-docs)
8. You can see all the end point
8.  Note : create folder `Uploads`in app's directory for uploads file

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
```
DB_SERVER=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_master

APP_KEY=UjangGabut
PORT=1000
APP_URL=localhost:1000
```

