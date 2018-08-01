import React, { Component } from 'react';
import { Layout } from 'antd';

/* Load amplofy */
import Amplify, { Auth, Storage } from 'aws-amplify';

/* Load local files */
import './App.css';
import { Header } from './components/template/';
import Main from './components/Main';
import { poolData, bucket } from './config.json';

/* Initialize amplify */
Amplify.configure({
  Auth: poolData,
  Storage: {
    bucket: bucket
  }
});


class App extends Component {

  state = {
    userLoggedIn: false,
    loggedInUser: null,
    imgURL: null,
    verified: false
  }

  componentDidMount() {
    Auth.currentSession()
      .then((response) => {
        this.setApplicationUser(response);
      })
      .catch((error) => console.error(error));
  }

  signOut = () => {
    Auth.signOut()
      .then(data => {
        this.setState({
          userLoggedIn: false,
          loggedInUser: null
        });
      })
      .catch(err => console.log(err));
  }

  setApplicationUser = (loggedInUser) => {
    console.log(loggedInUser);

    this.setState({
      userLoggedIn: true,
      loggedInUser,
      verified: loggedInUser.idToken.payload['email_verified']
    });

    Auth.currentCredentials()
      .then((response) => {
        console.log(response.data.IdentityId);
      })
      .catch((error) => console.error(error));

    Storage.get('photo.jpg', { level: 'private' })
      .then(result => {
        console.log(result);
        this.setState((state) => {
          state.loggedInUser['profileURL'] = result;
          return state;
        });
      })
      .catch(err => console.log(err));
  }

  render() {

    return (
      <Layout className="layout">
        <Header signOutHandler={this.signOut} userLoggedIn={this.state.userLoggedIn} verified={this.state.verified} />
        <Main
          userLoggedIn={this.state.userLoggedIn}
          handleSignIn={this.setApplicationUser}
          loggedInUser={this.state.loggedInUser}
        />
      </Layout>
    );

  }
}

export default App;
