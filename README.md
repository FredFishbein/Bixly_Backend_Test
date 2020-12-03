
Hello Bixly!



Getting Started:

Make sure you have all the necessary dependencies:

npm install

.gitignore and .env files contain necessary secrets and id's

I've omitted .gitignore for testing


Running the server:

Nodemon app.js


Testing the server application:

localhost:3000/login

Please follow the "Sign in with Google" token login.

The following json payloads are accessible from /cars /boats /trucks

The /:id is by Make.

Making POST requests, PUT and DELETING are available through Postman.
I was finding it rather difficut to get a solution to getting a token for Postman to access These methods once the route was protected. Any solutions to this?

Specifications:

The following application has a backend database in MongoDB. 
I've used Oath 2.0 from Google's API services for the authorization. 

I've disabled the login so please use the google button for testing purposes.

Thank you, Fred
