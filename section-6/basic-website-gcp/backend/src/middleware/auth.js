module.exports.requiresAuth = async (admin, req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedIdToken;
        next();
        return;
    } catch (e) {
        console.error(e);
        res.status(403).send('Unauthorized');
        return;
    }
};

module.exports.test = async (req, res, next) => {

    req.user = {
        uid: 'set a sample uid, for debugging purposes only'
    };
    next();

}