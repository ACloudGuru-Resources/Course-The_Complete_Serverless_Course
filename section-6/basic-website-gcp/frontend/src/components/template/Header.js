import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';

const { Header } = Layout;

const AppHeader = ({ signOutHandler, authenticated }) => (
    <Header>
        <div className="logo" />
        <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
        >
            <Menu.Item key="1">
                <Link to="/">Home</Link>
            </Menu.Item>
            {authenticated ?
                (
                    <Menu.Item key="2">
                        <button className="buttonLink" onClick={signOutHandler} >Sign out</button>
                    </Menu.Item>
                )
                :
                (
                    <Menu.Item key="2">
                        <Link to="/signin">Sign in</Link>
                    </Menu.Item>
                )
            }
            {!authenticated && (
                <Menu.Item key="3">
                    <Link to="/register">Register</Link>
                </Menu.Item>
            )}
        </Menu>
    </Header >
);

AppHeader.propTypes = {
    signOutHandler: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired
};

export default AppHeader;
