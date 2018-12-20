'use strict';

exports.handler = (inputEvent, context, callback) => {

    if (inputEvent.triggerSource === "PreSignUp_SignUp") {
        inputEvent.response.autoConfirmUser = true;
        callback(null, inputEvent);
        return;
    }

    callback(`Wrong Cognito Trigger ${inputEvent.triggerSource}`);
};