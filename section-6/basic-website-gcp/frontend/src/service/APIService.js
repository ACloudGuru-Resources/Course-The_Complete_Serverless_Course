class APIService {
    constructor(APIEndpoint) {
        this.APIEndpoint = APIEndpoint;
    }

    callAPIWithAuth(path, accessToken, options = {}) {
        const bearer = `Bearer ${accessToken}`;
        const callOptions = {
            ...options,
            withCredentials: true,
            headers: {
                ...options.headers,
                Authorization: `${bearer}`,
            },
        };

        return this.callAPI(`${path}`, callOptions);
    }

    callAPI(path, options = {}) {
        const callOptions = {
            'Content-Type': 'application/json',
            ...options,
        };
        return fetch(`${this.APIEndpoint}/${path}`, callOptions);
    }
}

export default APIService;
