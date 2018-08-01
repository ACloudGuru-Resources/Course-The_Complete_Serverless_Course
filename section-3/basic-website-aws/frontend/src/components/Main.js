import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { Footer } from './template';
import Profile from './profile/Profile';
import SignUp from './SignUp';
import Verify from './Verify';

const { Content } = Layout;

const Main = (props) => {
    return (
        <Layout className="layout">
            <Content>
                <div className="App">

                    <header className="App-header">
                        <h1 className="App-title">Welcome to My cool AWS pool party</h1>
                    </header>
                    <div className="App-intro">
                        <Switch>
                            <Route exact path="/" render={() => <Profile isSignedIn={props.userLoggedIn} handleSignIn={props.handleSignIn} loggedInUser={props.loggedInUser} profileUrl={(props.loggedInUser && props.loggedInUser.profileURL) || ''} />} />
                            <Route exact path="/signup" render={() => <SignUp userLoggedIn={props.userLoggedIn} />} />
                            <Route exact path="/verify" render={() => <Verify auth={props.authMod} userLoggedIn={props.userLoggedIn} verified={props.userVerified} />} />
                        </Switch>
                    </div>

                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

Main.propTypes = {
    userLoggedIn: PropTypes.bool.isRequired,
    handleSignIn: PropTypes.func.isRequired,
    loggedInUser: PropTypes.object
};

export default Main;
