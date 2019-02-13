import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { Footer } from './template';
import Home from './pages/Home';
import Register from './pages/Register';
import Signin from './pages/SignIn';

const { Content } = Layout;

const Main = (props) => {
    return (
        <Layout className="layout">
            <Content>
                <div className="App">

                    <header className="App-header">
                        <h1 className="App-title">Welcome to My cool GCP pool party</h1>
                    </header>

                    {props.error &&
                        (
                            <p>
                                Error: <br />
                                {props.error}
                            </p>
                        )
                    }

                    <div className="App-intro">
                        {props.loading ?
                            (
                                <p>
                                    Loading
                                </p>
                            )
                            :
                            (<Switch>
                                <Route exact path="/" render={() => <Home {...props} />
                                } />
                                <Route exact path="/register" render={() => <Register fbAuth={props.fbAuth} />} />
                                <Route exact path="/signin" render={() => <Signin fbAuth={props.fbAuth} />} />
                            </Switch>)
                        }
                    </div>

                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

Main.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.object,
    picture: PropTypes.string,
    error: PropTypes.string
};

export default Main;
