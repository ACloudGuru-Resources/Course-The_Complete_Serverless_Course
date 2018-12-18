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

    // Instantiate the Auth0Lock library
    const lock = new Auth0Lock(
      'CLIENT_ID',
      'DOMAIN'
    );
    this.lock = lock;

    // Listen for the authenticated event on the Auth0 lock library and call the 
    // onAuthenticated method
    this.lock.on('authenticated', this.onAuthentication)
  }

  componentWillMount() {

    // Check the local storage for the accessToken and profile information
    const accessToken = localStorage.getItem('accessToken');
    const profile = localStorage.getItem('profile');

    if (accessToken && profile) {

      // If they exist, load them into state
      this.setState({
        accessToken: accessToken,
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
      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));

      // Populate the state with the accessToken and local storage
      this.setState({
        accessToken: authResult.accessToken,
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');

    // Clean the state
    this.setState({ accessToken: null, profile: null });

    // Clear the Auth0 session then redirect back to the homepage
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
        </header>
      </div >
    );
  }
}

export default App;
