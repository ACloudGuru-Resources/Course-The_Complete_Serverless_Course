class APIService {
    constructor(APIEndpoint) {
        this.APIEndpoint = APIEndpoint;
    }

    callAPIWithAuth(path, jwtToken, options = {}) {
        const callOptions = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `${jwtToken}`,
            },
        };

        return this.callAPI(path, callOptions);
    }

    callAPI(path, options = {}) {
        const callOptions = {
            'Content-Type': 'application/json',
            ...options,
        };
        return fetch(`${this.APIEndpoint}/${path}`, callOptions).then((response) => response.json());
    }
}

export default APIService;
