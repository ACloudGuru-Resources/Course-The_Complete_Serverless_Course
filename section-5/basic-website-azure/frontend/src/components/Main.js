import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { Footer } from './template';
import Profile from './profile/Profile';

const { Content } = Layout;

const Main = (props) => {
    return (
        <Layout className="layout">
            <Content>
                <div className="App">

                    <header className="App-header">
                        <h1 className="App-title">Welcome to My cool Azure pool party</h1>
                    </header>

                    <div className="App-intro">
                        {props.error &&
                            (
                                <p>
                                    Error: <br />
                                    {props.error}
                                </p>
                            )
                        }
                        <Profile getStorage={props.getStorage} authenticated={props.authenticated} user={props.user} bathers={props.bathers} picture={props.picture} />
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
    picture: PropTypes.object,
    error: PropTypes.string
};

export default Main;
