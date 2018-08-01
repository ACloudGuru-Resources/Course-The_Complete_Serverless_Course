import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';

const { Header } = Layout;

const AppHeader = ({ signOutHandler, userLoggedIn, verified }) => (
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
            {userLoggedIn ?
                verified ?
                    (
                        <Menu.Item key="2">
                            <a onClick={signOutHandler} >Sign out</a>
                        </Menu.Item>
                    )
                    :
                    (
                        <Menu.Item key="2">
                            <Link to="/verify">Verify</Link>
                        </Menu.Item>
                    )
                :
                (
                    <Menu.Item key="3">
                        <Link to="/signup">Sign up</Link>
                    </Menu.Item>
                )
            }
        </Menu>
    </Header>
);

AppHeader.propTypes = {
    signOutHandler: PropTypes.func.isRequired,
    userLoggedIn: PropTypes.bool.isRequired,
    verified: PropTypes.bool.isRequired,
};

export default AppHeader;
