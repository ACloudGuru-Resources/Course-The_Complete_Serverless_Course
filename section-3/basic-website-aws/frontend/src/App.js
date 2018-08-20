import React, { Component } from 'react';
import { Layout } from 'antd';

/* Load amplofy */
import Amplify, { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';

/* Load local files */
import './App.css';
import { Header } from './components/template/';
import Main from './components/Main';
import { poolData, bucket, region } from './config.json';

/* Initialize amplify */
Amplify.configure({
  Auth: poolData
});


class App extends Component {

  state = {
    userLoggedIn: false,
    loggedInUser: null,
    imgURL: null,
    verified: false,
    identityId: null
  }

  updatedProfile = (S3, fileName) => {
    const params = {
      Bucket: bucket,
      Key: `${fileName}`
    };

    const url = S3.getSignedUrl('getObject', params);
    console.log(url);
    this.setState({
      imgURL: url
    });
  }

  uploadProfile = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    Auth.currentCredentials()
      .then((response) => {
        const creds = response.data.Credentials;

        const S3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: bucket },
          region: region,
          credentials: new AWS.Credentials(creds.AccessKeyId, creds.SecretKey, creds.SessionToken)
        });

        const params = {
          Body: file,
          ContentType: file.type,
          Bucket: bucket,
          Key: `${response.identityId}/profile.png`
        };

        S3.putObject(params).promise().then(() => {
          console.log('upload complete');
          this.updatedProfile(S3, `${response.identityId}/profile.png`);
        }).catch((e) => {
          // console.error(e);
        });
      });
  }

  componentDidMount() {
    Auth.currentSession()
      .then((response) => {
        this.setApplicationUser(response);
      })
      .catch((error) => {
        //console.error(error)
      });
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

        this.setState({
          identityId: response.data.IdentityId
        });

        const creds = response.data.Credentials;

        const S3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: bucket },
          region: region,
          credentials: new AWS.Credentials(creds.AccessKeyId, creds.SecretKey, creds.SessionToken)
        });

        this.updatedProfile(S3, `${response.identityId}/profile.png`);

      }).catch((e) => {
        // console.error(e);
      });

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
          uploadProfile={this.uploadProfile}
          imgURL={this.state.imgURL}
        />
      </Layout>
    );

  }
}

export default App;
