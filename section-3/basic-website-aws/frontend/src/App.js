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
    verified: false,
    identityId: null
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
      .then(() => {
        this.setState({
          userLoggedIn: false,
          loggedInUser: null,
          identityId: null
        });
      })
      .catch(err => console.log(err));
  }

  handleSignUp = (data, history) => {
    if (data) {
      this.setState({
        userLoggedIn: true,
        verified: data.userConfirmed
      });
      history.push('/verify')
    }
  }

  setApplicationUser = (loggedInUser) => {
    console.log('Logged in user: ', loggedInUser);

    this.setState({
      userLoggedIn: true,
      loggedInUser,
      verified: loggedInUser.idToken.payload['email_verified']
    });

    Auth.currentCredentials()
      .then((response) => {
        console.log('User Identity Id: ', response.data.IdentityId);
        this.setState({
          identityId: response.data.IdentityId
        });
      })
      .catch((error) => console.error(error));

    Storage.get('photo.jpg', {
      level: 'private'
    })
      .then(result => {
        console.log('storage get result: ', result);
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
          handleSignUp={this.handleSignUp}
          identityId={this.state.identityId}
        />
      </Layout>
    );

  }
}

export default App;
