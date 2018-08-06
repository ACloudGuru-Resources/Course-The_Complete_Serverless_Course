import React from 'react';
import { withAPIService } from '../../hoc';

class Bathers extends React.Component {

    state = {
        bathers: '',
        loading: true
    }

    async componentDidMount() {
        let responseJSON = { bathers: 'error' };

        try {
            const response = await this.props.APIService.callAPIWithAuth(
                'bathers',
                this.props.loggedInUser.idToken.jwtToken
            );

            responseJSON = { bathers: response.bathers };
        } catch (e) {
            console.error('error getting bathers', e);
        }

        this.setState({
            bathers: responseJSON.bathers,
            loading: false
        });
    }

    render() {
        return (
            <div>
                <b>Bather preference: </b>{this.state.loading ? 'Loading...' : `${this.state.bathers}`}
            </div>
        )
    }

}

const WrappedComponent = withAPIService(Bathers);

export default WrappedComponent;