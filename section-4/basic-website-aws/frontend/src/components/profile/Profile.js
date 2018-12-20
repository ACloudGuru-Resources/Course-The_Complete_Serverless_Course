import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Avatar, Card } from 'antd';
import SignInForm from './SignInForm';
import Bathers from './Bathers';

const Profile = ({ loggedInUser, APIEndpoint, profileUrl, isSignedIn, handleSignIn, identityId, uploadProfile }) => {
    const WrappedSignInForm = Form.create()(SignInForm);
    const displayForm = !isSignedIn && <WrappedSignInForm handleSignIn={handleSignIn} />;

    return (
        <Row>
            <Col span={8} offset={8} style={{ paddingTop: 20 }}>
                {
                    isSignedIn ? (
                        <Card style={{ textAlign: 'left' }}>
                            <h2>{loggedInUser.idToken.payload['cognito:username']}</h2>
                            <Row>
                                <Col span={12} style={{ paddingTop: 20 }}>
                                    {
                                        profileUrl && <Avatar style={styles.avatar} icon="user" src={profileUrl} />
                                    }
                                </Col>
                                <Col span={12} style={{ paddingTop: 20 }}>
                                    <input type="file" onChange={uploadProfile} accept="image/png" id="fileinput" />
                                </Col>
                            </Row>

                            <Bathers loggedInUser={loggedInUser} APIEndpoint={APIEndpoint} /><br />

                            <hr />
                            <Row>
                                <Col span={6} style={{ paddingTop: 20 }}>
                                    <b>User Sub:</b>
                                </Col>
                                <Col span={18} style={{ paddingTop: 20 }}>
                                    {loggedInUser.idToken.payload.sub}
                                </Col>
                            </Row>

                            <Row>
                                <Col span={6} style={{ paddingTop: 20 }}>
                                    <b>Identity Id:</b>
                                </Col>
                                <Col span={18} style={{ paddingTop: 20 }}>
                                    {identityId}
                                </Col>
                            </Row>

                            <Row>
                                <Col span={6} style={{ paddingTop: 20 }}>
                                    <b>ID Token:</b>
                                </Col>
                                <Col span={18} style={{ paddingTop: 20 }}>
                                    <span style={styles.token}>{loggedInUser.idToken.jwtToken}</span>
                                </Col>
                            </Row>
                        </Card>
                    ) :
                        (
                            <div>
                                {displayForm}
                            </div>
                        )
                }
            </Col>
        </Row >
    )
}

const styles = {
    avatar: {
        width: 100,
        height: 100,
        lineHeight: 100,
        borderRadius: 50
    },
    token: {
        whiteSpace: 'pre-wrap',
        maxWidth: '100%',
        wordBreak: 'break-word',
        backgroundColor: '#DFD8D9',
        display: 'block',
        padding: 2,
        borderRadius: 3,
    }
}

Profile.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    handleSignIn: PropTypes.func.isRequired,
    loggedInUser: PropTypes.object,
};

export default Profile;
