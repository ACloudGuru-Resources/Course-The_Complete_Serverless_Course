import React, { Component } from 'react';
import { Layout } from 'antd';
import * as hello from 'hellojs';

/* Load local files */
import './App.css';
import { Header } from './components/template/';
import Main from './components/Main';
import { withAPIService } from './hoc';
import config from './config.json';
import {
  getAuthUrl,
  getGrantUrl,
  getLogoutUrl
} from './lib/msHelper';
import {
  jwtDecode,
} from './lib/jwtHelper';


class App extends Component {

  state = {
    authenticated: false,
    error: '',
    user: null,
    picture: null,
    response: null,
    network: null
  }

  handleAuthLogin = ({ authResponse }) => {

    const { access_token, id_token, network } = authResponse;

    const decodedIDToken = jwtDecode(id_token);

    this.setState({
      network: network,
      authenticated: true,
      user: {
        accessToken: access_token,
        idToken: id_token,
        firstName: decodedIDToken.payload.given_name,
        lastName: decodedIDToken.payload.family_name,
        id: decodedIDToken.payload.oid
      }
    });

    this.getStorage();
  }

  getStorage = () => {

    return this.props.APIService.callAPIWithAuth(
      `getBlobSAS`,
      this.state.user.accessToken,
      {
        method: "POST",
        body: JSON.stringify({ blobName: 'profile.png' })
      }
    )
      .then(response => response.json())
      .then(picture => { this.setState({ picture }); })
      .catch(e => { this.setState({ picture: 'Error' }) });

  }

  signUp = async () => {
    await hello.login('azureADSignup');
  }

  signIn = async () => {
    await hello.login('azureADSignin');
  }

  signOut = async () => {
    await hello.logout(this.state.network, { force: true });
  }

  // When the page loads, we want to initialize our MSAL client and check if the user is signed in
  componentDidMount() {

    const {
      tenantName,
      signUpPolicyName,
      signInPolicyName,
      redirectUrl,
      backendClientApiID,
      backendClientScopeName,
      backendClientID
    } = config;

    hello.init({
      azureADSignin: {
        name: 'Azure Active Directory B2C',
        oauth: {
          version: 2,
          auth: getAuthUrl(tenantName, signInPolicyName),
          grant: getGrantUrl(tenantName, signInPolicyName)
        },
        refresh: true,
        scope_delim: ' ',
        logout: function () {
          window.location = getLogoutUrl(tenantName, signInPolicyName, redirectUrl);
          return true
        },
        form: false
      },
      azureADSignup: {
        name: 'Azure Active Directory B2C',
        oauth: {
          version: 2,
          auth: getAuthUrl(tenantName, signUpPolicyName),
          grant: getGrantUrl(tenantName, signUpPolicyName)
        },
        refresh: true,
        scope_delim: ' ',
        logout: function () {
          window.location = getLogoutUrl(tenantName, signUpPolicyName, redirectUrl);
          return true
        },
        form: false
      }
    });

    // Configure application details
    hello.init({ azureADSignin: backendClientID, azureADSignup: backendClientID }, {
      redirect_uri: redirectUrl,
      scope: `openid https://${tenantName}.onmicrosoft.com/${backendClientApiID}/${backendClientScopeName}`,
      response_type: 'token id_token',
      resource: `${backendClientApiID}`,
      display: 'page',
    });

    hello.on('auth.login', (auth) => {
      this.handleAuthLogin(auth);
    });

  }

  render() {
    return (
      <Layout className="layout">
        <Header signInHandler={this.signIn} signUpHandler={this.signUp} signOutHandler={this.signOut} authenticated={this.state.authenticated} />
        <Main
          authenticated={this.state.authenticated}
          handleSignIn={this.signIn}
          user={this.state.user}
          picture={this.state.picture}
          getStorage={this.getStorage}
          error={this.state.error}
        />
      </Layout>
    );
  }
}

const WrappedComponent = withAPIService(App);

export default WrappedComponent;