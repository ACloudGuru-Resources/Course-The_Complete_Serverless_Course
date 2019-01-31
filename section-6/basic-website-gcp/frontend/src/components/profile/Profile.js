import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Avatar, Card } from 'antd';
import Bathers from './Bathers';


class Profile extends Component {

    state = {
        message: null
    }

    uploadProfile = async (e) => {
        e.preventDefault();

        let browserFile = e.target.files[0];
        if (!browserFile) { return; }
        const name = `users/${this.props.user.id}/profile.png`;
        const metadata = { contentType: browserFile.type };
        const ref = this.props.fbStorage.ref();
        this.setState({ message: 'Uploading' });
        await ref.child(name).put(browserFile, metadata);
        this.setState({ message: 'Uploaded!' });
        this.setState({ message: null });

        this.props.getStorage();

    }

    render() {
        const { user, picture } = this.props;
        return (
            <Row>
                <Col span={20} offset={2} style={{ paddingTop: 20 }}>
                    <Card style={{ textAlign: 'left' }}>
                        <Row>
                            <Col span={24}>
                                <h2>{`${user.email}`}</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <Col span={24} style={{ paddingTop: 20 }}>
                                        <Avatar style={styles.avatar} icon="user" src={picture} />
                                        {this.state.message && <p>{this.state.message}</p>}
                                    </Col>
                                    <Col span={24} style={{ paddingTop: 20 }}>
                                        <input type="file" onChange={this.uploadProfile} accept="image/png" id="fileinput" />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Bathers user={user} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col span={6} style={{ paddingTop: 20 }}>
                                <b>User Id:</b>
                            </Col>
                            <Col span={18} style={{ paddingTop: 20 }}>
                                {user && user.id}
                            </Col>
                        </Row>

                        <Row>
                            <Col span={6} style={{ paddingTop: 20 }}>
                                <b>ID Token:</b>
                            </Col>
                            <Col span={18} style={{ paddingTop: 20 }}>
                                <pre style={styles.token}>{user && user.idToken}</pre>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row >
        );
    }
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
    getStorage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    picture: PropTypes.string
};

export default Profile;
