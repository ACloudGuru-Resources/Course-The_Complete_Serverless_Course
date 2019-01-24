const jwtDecode = (t) => {
    let token = {};
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return (token)
}

export {
    jwtDecode
}