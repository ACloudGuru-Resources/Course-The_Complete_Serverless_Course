import React from 'react';
import { withAPIService } from '../../hoc';
import { Row, Col } from 'antd';

class Bathers extends React.Component {

    state = {
        bathers: '',
        loading: true
    }

    getBathers = async () => {
        let responseJSON = { bathers: 'error' };

        try {

            const response = await this.props.APIService.callAPIWithAuth(
                'bathers/',
                this.props.user.idToken
            ).then(response => response.json())

            responseJSON = { bathers: response.found ? response.data : 'Not set' };

        } catch (e) {
            console.error('error getting bathers', e);
        }

        this.setState({
            bathers: responseJSON.bathers,
            loading: false
        });
    }

    updateBathers = async () => {

        const bathersPreference = this.refs['bathersPrefs'].value;

        let responseJSON = { bathers: 'error' };

        try {
            const response = await this.props.APIService.callAPIWithAuth(
                'bathers/',
                this.props.user.idToken,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        bathersPreference: bathersPreference
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(response => response.json());

            responseJSON = { bathers: response && response.changed && bathersPreference };
            this.refs['bathersPrefs'].value = '';

        } catch (e) {
            console.error('error getting bathers', e);
        }

        this.setState({
            bathers: responseJSON.bathers,
        });

    }

    componentDidMount() {
        this.getBathers();
    }

    render() {
        return (
            <Row>
                <Col span={24} style={{ paddingTop: 20 }}>
                    <b>Bather preference: </b>{this.state.loading ? 'Loading...' : `${this.state.bathers}`}
                </Col>
                <Col span={24} style={{ paddingTop: 20 }}>
                    <input type="text" ref="bathersPrefs" /> <button onClick={this.updateBathers}>Update</button>
                </Col>
            </Row>
        )
    }

}

const WrappedComponent = withAPIService(Bathers);

export default WrappedComponent;