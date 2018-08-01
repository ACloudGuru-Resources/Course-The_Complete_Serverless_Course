# AWS Lab

## Prerequisites
- AWS CLI
- NodeJS

## Project

**Please deploy the serverless functions first**

### Setting up Authentication with Amazon Cognito
1. Navigate to Amazon Cognito
2. Click on Manage user pools
3. Pool name: pool-party
4. Click Review defaults
5. Click on attributes 
6. Make sure username is selected and 'Also allow sign in with verified email address' and 'Also allow sign in with preferred username (a username that your users can change)'
7. Click on App Clients
8. App client name: react frontend
9. Untick Enable sign-in API for server-based authentication (ADMIN_NO_SRP_AUTH)
10. Tick Enable username-password (non-SRP) flow for app-based authentication (USER_PASSWORD_AUTH)
11. Save app client changes
12. Click on policies
13. Tick Allow users to sign themselves up
14. Click on Triggers
15. Select the auto confirm lambda function in the presignup trigger
14. Create the identity pool
15. Create a federated identity
16. In authentication providers, click on the cognito tab and fill in the:
    user pool id
    app client id

### Setting up Authentication with API Gateway
1. Navigate to API Gateway
2. Create a new API Gateway 'acg-pool-party'
3. Add an authorizer :
    name: cognito_auth
    Type: Cognito
    Cognito User Pool: pool-party
    Token Source: Authorization
4. Click Create
5. Create a new resource
    Resource Name: bathers
    Enable API Gateway CORS: tick
6. Click create resource
7. Click on create new method
8. Select GET, then click the tick
9. Click on GET
10. Configure:
    Authorization: cognito_auth
    HTTP Request Headers: Name = Authorization
11. Action -> Deploy API
