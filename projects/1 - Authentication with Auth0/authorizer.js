const jwt = require('jsonwebtoken');
const rp = require('request-promise');

const getJWTTokenFromAuthHeader = (authHeader) => {

    if (!authHeader) {
        throw new Error('Could not find Auth Header');
    }

    const jwtToken = authHeader.split(' ')[1];
    if (!jwtToken) {
        throw new Error('Could not find JWT token in authToken');
    }

    return jwtToken;
}

const getFirstAuth0JWKSKey = (Auth0ApiBaseUrl) => {

    if (!Auth0ApiBaseUrl) {
        throw new Error('Auth0ApiBaseUrl is not set or empty');
    }

    return rp(`https://${Auth0ApiBaseUrl}/.well-known/jwks.json`)
        .then((jwks) => {

            const jwksKey = JSON.parse(jwks).keys[0];

            //Check there is a jwks key
            if (!jwksKey) {
                throw new Error('No supported jwt keys');
            }

            return jwksKey;
        });
}

const getCertFromJwksKeyAndToken = (decodedToken, jwksKey, alg) => {

    //Validate the algorithm
    if (jwksKey.alg !== alg || decodedToken.header.alg !== alg) {
        throw new Error(`Invalid algorithm used, only ${alg} supported`);
    }

    //Validate the signing key
    if (!jwksKey.kid || decodedToken.header.kid !== jwksKey.kid) {
        throw new Error('Invalid signing algorithm');
    }

    //Validate the certificate
    if (!jwksKey.x5c[0]) {
        throw new Error('No certificate found');
    }

    const cert = `-----BEGIN CERTIFICATE-----\n${jwksKey.x5c[0]}\n-----END CERTIFICATE-----\n`;

    return cert;
}

const verifyJWTToken = (decodedJWTToken, publicKey, alg) => {

    return new Promise((resolve, reject) => {

        jwt.verify(decodedJWTToken, publicKey, { algorithms: [alg] }, (error, data) => {
            error ? reject(error) : resolve(data);
        });

    });

};

const validateAuth0Token = async (AuthHeader, Auth0ApiBaseUrl, alg) => {

    // 1. Get the JWT Token frome the Authorization Header Bearer Token
    const jwtToken = await getJWTTokenFromAuthHeader(AuthHeader);

    // 2. Decode the JWT Bearer token
    const decodedJWTToken = jwt.decode(jwtToken, { complete: true });

    // 3. Get the Auth0 Domain's first public JWKS Key
    const firstAuth0JWKSKey = await getFirstAuth0JWKSKey(Auth0ApiBaseUrl);

    // 4. Get Auth0 Public Key
    const publicKey = await getCertFromJwksKeyAndToken(decodedJWTToken, firstAuth0JWKSKey, alg);

    // 5. Verify the jwt Token against the public key
    return verifyJWTToken(jwtToken, publicKey, alg);

}

module.exports = validateAuth0Token;