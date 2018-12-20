import React from 'react';
import { APIService } from '../service';
import { APIEndpoint } from '../config.json';

const withAPIService = (Component) => {

    class HOC extends React.Component {

        APIServiceInstance = new APIService(APIEndpoint);

        render() {
            return (
                <Component
                    APIService={this.APIServiceInstance}
                    {...this.props}
                />
            )
        }
    }

    return HOC;

}

export default withAPIService;