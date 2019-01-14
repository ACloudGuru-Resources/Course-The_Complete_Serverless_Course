# Project 1 - Authentication with Auth0

## Prerequisites
- NodeJS 8.10+
- An IDE

## Steps - Part 1

### Backend

#### Auth0 Account creation

1. Navigate to auth0.com in your chosen browser
2. Click **Sign Up**
3. Enter your email address and choose a password, then click **sign up**
4. Enter a tenant domain e.g. acg.auth0.com
5. Make note of this tenant domain
6. Select your **region**
7. Click **Next**
8. Select **Personal** as your account type
9. Then **Developer** as your role
10. For the **project** field, select the `Just playing around` option, then click **next**
11. Go into your email account and click the **verify your account** button in the Auth0 email

#### Creating registered application

1. Log into the Auth0 portal
2. Click on **Applications** in the sidebar
3. Click on **Default App**
4. Scroll down and select `Single Page Application` from the **Application Type** dropdown
5. Put `http://localhost:3000` into **Allowed callback URLs**, **Allowed Web Origins** and **Allowed Logout URLs**
6. Scroll down and click on **Save Changes**
7. Make a note of the Client ID

### Frontend

#### Setup

1. Run `npx create-react-app auth0-app-frontend`
2. Change into the new directory `cd auth0-app-frontend`
3. Install the Auth0 lock package `npm install --save auth0-lock`
4. Test that the page works by typing `npm start`
5. Open `src/App.js` in your text editor and replace it with the code below

```javascript

import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
      </div >
    );
  }
}

export default App;

```

#### Code

1. Open `src/App.js` in your text editor
2. Add the following after the `class App extends Component{` line

```javascript

state = {
    accessToken: null,
    profile: null
}

```

3. Add the following to the top of the App.js file

```javascript

import { Auth0Lock } from 'auth0-lock';

```

4. Now initialise the Auth0 lock package by adding it to the constructor. Add the following after the state

```javascript

constructor() {
    super();
    const lock = new Auth0Lock(
      'CLIENT_ID',
      'DOMAIN'
    );
    this.lock = lock;
    this.lock.on('authenticated', this.onAuthentication)
  }

```

5. Now lets add the `onAuthenticated` method

```javascript

onAuthentication = (authResult) => {
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) {
        return;
      }

      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));

      this.setState({
        accessToken: authResult.accessToken,
        profile: profile
      })
    });
  }

```

6. Add the following between the `<header>` tags in the render method

```javascript

{
    this.state.accessToken ?
        (
            <div>
                <p>
                {this.state.profile.name} is logged in
                </p>
                <button onClick={this.logout}>Logout</button>
            </div>
        )
        :
        (
            <div>
                <p>
                User is not logged in
                </p>
                <button onClick={this.showLogin}>Login</button>
            </div>
        )
}

```

7. We currently don't have any login or logout methods so lets add them in

```javascript

showLogin = () => {
    this.lock.show();
}

logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    this.setState({ accessToken: null, profile: null });
    this.lock.logout({
        returnTo: 'http://localhost:3000'
    });
}

```

8. Finally, we want to check if the local state exists when the page refreshes so add a method that will run every time the page is loaded

```javascript

componentWillMount() {
    const accessToken = localStorage.getItem('accessToken');
    const profile = localStorage.getItem('profile');

    if (accessToken && profile) {
        this.setState({
        accessToken: accessToken,
        profile: JSON.parse(profile)
        })
    }
}

```

1. Perfect, you should now have the following

```javascript

import React, { Component } from 'react';
import { Auth0Lock } from 'auth0-lock';
import './App.css';

class App extends Component {
  state = {
    accessToken: null,
    profile: null
  }
  constructor() {
    super();
    const lock = new Auth0Lock(
      'CLIENT_ID',
      'DOMAIN'
    );
    this.lock = lock;
    this.lock.on('authenticated', this.onAuthentication)
  }
  componentWillMount() {
    const accessToken = localStorage.getItem('accessToken');
    const profile = localStorage.getItem('profile');

    if (accessToken && profile) {
      this.setState({
        accessToken: accessToken,
        profile: JSON.parse(profile)
      })
    }
  }
  onAuthentication = (authResult) => {
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) {
        return;
      }

      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));

      this.setState({
        accessToken: authResult.accessToken,
        profile: profile
      })
    });
  }
  showLogin = () => {
    this.lock.show();
  }
  logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    this.setState({ accessToken: null, profile: null });
    this.lock.logout({
      returnTo: 'http://localhost:3000'
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">

          {
            this.state.accessToken ?
              (
                <div>
                  <p>
                    {this.state.profile.name} is logged in
                  </p>
                  <button onClick={this.logout}>Logout</button>
                </div>
              )
              :
              (
                <div>
                  <p>
                    User is not logged in
                  </p>
                  <button onClick={this.showLogin}>Login</button>
                </div>
              )
          }
        </header>
      </div >
    );
  }
}

export default App;

```



## Steps - Part 2

### Backend
1. Move back a directory
2. Run the following command in that directory
```bash
  sls create  --template aws-nodejs --name auth0-backend --path auth0-app-backend
```
3. Change into the new `cd auth0-app-backend` then run
```bash
  npm install -y
  npm install axios --save
```
4. Make a new directories called `src/authorizer` and `src/hello-world`
5. Move `handler.js` into `src/hello-world/` and add the headers return object
```javascript
'use strict';

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

```
6. Open the `serverless.yml` file and replace the contents with the code below to give our function an API endpoint of `/hello`
```yaml
service: auth0-backend

provider:
  name: aws
  runtime: nodejs8.10

functions:
  hello:
    handler: src/hello-world/handler.hello
    events:
      - http:
          path: hello
          method: get
```
7. Run `sls deploy` and make note of the ServiceEndpoint Stack Outputs URL, this is your `API_BASE_URL`

### Frontend
1. Install the Axios library for the frontend
```
npm install --save axios
```
2. In `src/App.js` Create a new state object called `response`
3. Add a new global variable called `API_BASE_URL` outside of your class. Put your API endpoint in this value
```javascript
const API_BASE_URL = '';
```
4. Add the following snippet above the `</header>` tag
```jsx
        <div>
          <button onClick={this.checkFunction}>Hello?</button>
          <div>
            Response: {this.state.response}
          </div>
        </div>
```
3. Create a new fat arrow class function called `checkFunction` and fill it with the axios request to your API.
On success, set the state to the response of the function, also add some error handling
```
checkFunction = () => {
  axios.get('/hello', {
      baseURL: API_BASE_URL
    })
      .then((response) => {
        this.setState({
          response: response.data
        });
      })
      .catch((error) => {
        let errorMessage = '';
        //This is from the docs https://github.com/axios/axios#handling-errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = error.response.data;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errorMessage = error.request;
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Error ${error.message}`;
        }

        this.setState({
          response: errorMessage
        });
      });
}
```

## Troubleshooting

#### I get a message from Auth0 starting with oops
Go back to your Auth0 application page and ensure that you've put in the correct url when you run `npm start` 
Also check that you've added the correct `DOMAIN` and `CLIENT_ID` to the Auth0 constructor

## Reference

Auth0 Lock v11 API - https://auth0.com/docs/libraries/lock/v11/api