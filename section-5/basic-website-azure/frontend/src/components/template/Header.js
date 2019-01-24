import React from 'react';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';

const { Header } = Layout;

const AppHeader = ({ signInHandler, signUpHandler, signOutHandler, authenticated }) => (
    <Header>
        <div className="logo" />
        <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
        >
            {authenticated ?
                (
                    <Menu.Item key="1">
                        <a onClick={signOutHandler} >Sign out</a>
                    </Menu.Item>
                )
                :
                (
                    <Menu.Item key="1">
                        <a onClick={signInHandler} >Sign in</a>
                    </Menu.Item>
                )
            }
            {!authenticated &&
                (
                    < Menu.Item key="2">
                        <a onClick={signUpHandler} >Register</a>
                    </Menu.Item>
                )
            }
        </Menu>
    </Header >
);

AppHeader.propTypes = {
    signOutHandler: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired
};

export default AppHeader;
