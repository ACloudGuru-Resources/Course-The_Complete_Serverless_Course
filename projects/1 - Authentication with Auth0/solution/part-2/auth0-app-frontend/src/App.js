import React, { Component } from 'react';
import { Auth0Lock } from 'auth0-lock';
import axios from 'axios';
import './App.css';
import * as Config from './creds.json';

const API_BASE_URL = Config.API_BASE_URL;

class App extends Component {

  state = {
    idToken: null,
    profile: null,
    response: ''
  }

  constructor() {
    super();

    const params = {
      autoclose: true,
      oidcConformant: true,
      auth: {
        params: {
          scope: 'openid profile email'
        },
        responseType: 'token id_token'
      }
    };

    // Instantiate the Auth0Lock library
    const lock = new Auth0Lock(
      Config.AUTH0_CLIENT_ID,
      Config.AUTH0_DOMAIN,
      params
    );
    this.lock = lock;

    // Listen for the authenticated event on the Auth0 lock library and call the 
    // onAuthenticated method
    this.lock.on('authenticated', this.onAuthentication)
  }

  componentWillMount() {

    // Check the local storage for the accessToken and profile information
    const idToken = localStorage.getItem('idToken');
    const profile = localStorage.getItem('profile');

    if (idToken && profile) {

      // If they exist, load them into state
      this.setState({
        idToken: idToken,
        profile: JSON.parse(profile)
      });

    }

  }

  onAuthentication = (authResult) => {
    // If we've authenticated, we'll have an access token.
    // Use that access token to make an api call to Auth0 and retreive the user's profile information
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {

      if (error) {
        console.error(error);
        return;
      }

      // After we get the profile, save both the accessToken and profile information
      // into the local storage
      localStorage.setItem('idToken', authResult.idToken);
      localStorage.setItem('profile', JSON.stringify(profile));

      // Populate the state with the accessToken and local storage
      this.setState({
        idToken: authResult.idToken,
        profile: profile
      });

    });

  }

  showLogin = () => {

    // Show the Auth0 popup window using the Auth0 lock library
    this.lock.show();

  }

  logout = () => {

    // Clear the localStorage
    localStorage.removeItem('idToken');
    localStorage.removeItem('profile');

    // Clean the state
    this.setState({ idToken: null, profile: null });

    // Clear the Auth0 session then redirect back to the homepage
    this.lock.logout();

  }
  checkFunction = () => {
    const idToken = this.state.idToken;
    console.log(idToken);
    axios.get('/hello', {
      baseURL: API_BASE_URL,
      headers: {
        Authorization: idToken ? `Bearer ${idToken}` : null
      }
    })
      .then((response) => {
        this.setState({
          response: (response && response.data && response.data.message) || 'Invalid response'
        });
      })
      .catch((error) => {
        let errorMessage = '';
        //This is from the docs https://github.com/axios/axios#handling-errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Response Error: ${error.response.data}`;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errorMessage = `Request Error: ${error.message}`;
        } else if (error.message) {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Error ${error.message}`;
        }
        else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Error ${error}`;
        }

        this.setState({
          response: errorMessage
        });
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">

          {
            this.state.idToken ?
              (
                // We're logged in
                // Load the user's name and a logout button
                <div>
                  <p>
                    {this.state.profile.name} is logged in
                  </p>
                  <button onClick={this.logout}>Logout</button>
                </div>
              )
              :
              (
                // We're not logged in yet
                // Display the login button
                <div>
                  <p>
                    User is not logged in
                  </p>
                  <button onClick={this.showLogin}>Login</button>
                </div>
              )
          }

          <div>
            <button onClick={this.checkFunction}>Hello?</button>
            <div>
              Response: {this.state.response}
            </div>
          </div>

        </header>
      </div >
    );
  }
}

export default App;
