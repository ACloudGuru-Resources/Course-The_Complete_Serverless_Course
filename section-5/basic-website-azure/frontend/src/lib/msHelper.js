const getAuthUrl = (tenant, policy) => {
    return getOauthUrl(tenant, policy) + '/authorize';
}

const getGrantUrl = (tenant, policy) => {
    return getOauthUrl(tenant, policy) + '/token';
}

const getLogoutUrl = (tenant, policy, redirectUri) => {
    return getOauthUrl(tenant, policy) + '/logout'
        + '?post_logout_redirect_uri=' + encodeURI(redirectUri);
}

const getOauthUrl = (tenant, policy) => {
    return `https://${tenant}.b2clogin.com/te/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0`;
}

export {
    getAuthUrl,
    getGrantUrl,
    getLogoutUrl,
    getOauthUrl
}