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
    response: null
  }

  handleAuthLogin = ({ authResponse }) => {

    const { access_token, id_token } = authResponse;

    const decodedIDToken = jwtDecode(id_token);

    this.setState({
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

  signIn = async () => {
    await hello.login('azureAD');
  }

  signOut = async () => {
    await hello.logout('azureAD', { force: true });
  }

  // When the page loads, we want to initialize our MSAL client and check if the user is signed in
  componentDidMount() {

    const {
      tenantName,
      policyName,
      redirectUrl,
      backendClientApiID,
      backendClientScopeName,
      backendClientID
    } = config;

    hello.init({
      azureAD: {
        name: 'Azure Active Directory B2C',
        oauth: {
          version: 2,
          auth: getAuthUrl(tenantName, policyName),
          grant: getGrantUrl(tenantName, policyName)
        },
        refresh: true,
        scope_delim: ' ',
        logout: function () {
          window.location = getLogoutUrl(tenantName, policyName, redirectUrl);
          return true
        },
        form: false
      }
    });

    // Configure application details
    hello.init({ azureAD: backendClientID }, {
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
        <Header signInHandler={this.signIn} signOutHandler={this.signOut} authenticated={this.state.authenticated} />
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