import React from 'react';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';

const { Header } = Layout;

const AppHeader = ({ signInHandler, signOutHandler, authenticated }) => (
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
                        <button className="buttonLink" onClick={signOutHandler} >Sign out</button>
                    </Menu.Item>
                )
                :
                (
                    <Menu.Item key="1">
                        <button className="buttonLink" onClick={signInHandler} >Sign in</button>
                    </Menu.Item>
                )
            }
        </Menu>
    </Header >
);

AppHeader.propTypes = {
    signInHandler: PropTypes.func.isRequired,
    signOutHandler: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired
};

export default AppHeader;
