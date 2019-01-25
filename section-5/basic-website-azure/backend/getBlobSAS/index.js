// Based off of https://github.com/Azure-Samples/functions-dotnet-sas-token/blob/master/README.md

const azure = require('azure-storage');

const generateErrorResponse = (error, code) => {
    return {
        headers: {
            'content-type': 'application/json'
        },
        status: code || 400,
        body: JSON.stringify({
            error: error
        })
    };
};

const generateSasToken = async (container, blobName, permissions) => {

    const connString = process.env.AzureWebJobsStorage;
    const blobService = azure.createBlobService(connString);

    // Create a SAS token that expires in an hour
    // Set start time to five minutes ago to avoid clock skew.
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);

    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);

    permissions = permissions || azure.BlobUtilities.SharedAccessPermissions.READ;

    const sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: permissions,
            Start: startDate,
            Expiry: expiryDate
        }
    };

    const sasToken = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);

    const exists = await new Promise((resolve, reject) => {
        blobService.doesBlobExist(container, blobName, (error, result) => {
            if (!error) {
                resolve(result.exists)
            } else {
                reject(error)
            }
        });
    });

    return {
        token: sasToken,
        uri: blobService.getUrl(container, blobName, sasToken, true),
        exists
    };

}

module.exports = async (context, req) => {

    const { blobName } = req.body;
    const container = process.env.blobstorage_container_name;
    const userId = req.headers['x-ms-client-principal-id'];
    const permissions = 'rcw'; // Read, Create and Write. 
    //NOTE: The order of permissions matters https://docs.microsoft.com/en-us/rest/api/storageservices/Constructing-a-Service-SAS?redirectedfrom=MSDN#specifying-permissions

    if (!container) {

        context.res = generateErrorResponse('Specify a value for "container"');

    } else if (!blobName) {

        context.res = generateErrorResponse('Specify a value for "blobName"');

    } else {

        context.res = {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(await generateSasToken(container, `${userId}/${blobName}`, permissions))
        };

    }

};