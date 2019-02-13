const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({ origin: true });
const bathersPreference = require('./src/lib/bathersPreference.js');
const auth = require('./src/middleware/auth.js');

const app = express();

admin.initializeApp();

app.use(cors);
app.use(auth.requiresAuth.bind(null, admin));

const context = {
    functions, admin
}

app.get('/', (req, res) => bathersPreference.get(context, req, res));
app.post('/', (req, res) => bathersPreference.set(context, req, res));

exports.bathers = functions.https.onRequest(app);
