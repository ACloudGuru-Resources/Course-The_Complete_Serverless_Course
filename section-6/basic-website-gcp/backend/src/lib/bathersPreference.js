const get = async (context, req, res) => {

    const { admin } = context;

    const db = admin.firestore();

    const result = {
        found: false
    }

    const userId = req.user.uid;

    const dbResponse = await db.collection(`users`)
        .doc(userId)
        .get()
        .then(retreivedDoc => retreivedDoc.get('bathersPreference'))

    if (dbResponse) {
        result.found = true;
        result.data = dbResponse;
    }

    res.send(result);
};

const set = async (context, req, res) => {

    const { admin } = context;

    const { bathersPreference } = req.body;
    const result = {
        changed: false
    }
    if (!bathersPreference) {
        result.message = 'No bathersPreference passed';
        res.send(result);
        return;
    }

    const db = admin.firestore();

    const userId = req.user.uid;

    const dbResponse = await db.collection(`users`)
        .doc(userId)
        .set({
            bathersPreference
        }, {
                merge: true
            })

    if (dbResponse) {
        result.changed = true;
    }

    res.send(result);
}

module.exports = {
    get,
    set
}