import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Avatar, Card } from 'antd';
import Bathers from './Bathers';
import {
    Aborter,
    uploadBrowserDataToBlockBlob,
    BlockBlobURL,
    AnonymousCredential,
    StorageURL
} from "@azure/storage-blob";

class Profile extends Component {

    state = {
        message: null
    }

    uploadProfile = async (e) => {
        e.preventDefault();

        const blobSASURL = this.props.picture.uri;
        const reloadImage = this.props.getStorage;
        const blockBlobURL = new BlockBlobURL(blobSASURL, StorageURL.newPipeline(new AnonymousCredential()));

        let browserFile = e.target.files[0];
        await uploadBrowserDataToBlockBlob(Aborter.none, browserFile, blockBlobURL, {
            blockSize: 4 * 1024 * 1024,
            parallelism: 20,
            progress: ev => { this.setState({ message: `Uploading: ${ev.loadedBytes / browserFile.size * 100}%` }) }
        })
        this.setState({ message: 'Uploaded!' });
        await reloadImage();
        this.setState({ message: null });

    }

    render() {
        const { user, authenticated, picture } = this.props;
        return (
            <Row>
                <Col span={20} offset={2} style={{ paddingTop: 20 }}>
                    {
                        authenticated ?
                            (
                                <Card style={{ textAlign: 'left' }}>
                                    <Row>
                                        <Col span={24}>
                                            <h2>{`${user.firstName} ${user.lastName}`}</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Row>
                                                <Col span={24} style={{ paddingTop: 20 }}>
                                                    <Avatar style={styles.avatar} icon="user" src={picture && picture.exists && picture.uri} />
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
                            )
                            :
                            (
                                <div style={{ minHeight: '150px' }}>
                                    Please Sign in or Register
                                </div>
                            )
                    }
                </Col>
            </Row >
        )
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
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.object,
    picture: PropTypes.object
};

export default Profile;
