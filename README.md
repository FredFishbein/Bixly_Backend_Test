
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

Postman Token info: (Testing Purposes)

Token Name: Postman
Grant Type: Authorization Code
Callback URL https://oauth.pstmn.io/v1/callback
X Authorize using a browser
Auth URL: https://accounts.google.com/o/oauth2/auth
Access Token URL: https://accounts.google.com/oauth2token 
Client ID:553036228060-1ced5vi35014q1oh1qp6q9rivo522uuf.apps.googleusercontent.com
Client Secret: StFIIKq9K6Z0yQBi331biMyL
State:none
Client Auth: Send as Basic Auth

Specifications:

The following application has a backend database in MongoDB. 
I've used Oath 2.0 from Google's API services for the authorization. 

I've disabled the login so please use the google button for testing purposes.

Thank you, Fred
