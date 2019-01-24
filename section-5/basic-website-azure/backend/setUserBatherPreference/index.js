const azure = require('azure-storage');

module.exports = async function (context, req) {

    if (!(req.headers && req.headers['x-ms-client-principal-id'])) {
        context.res = {
            status: 403,
            body: JSON.stringify({ result: false })
        };
    }

    const userId = req.headers['x-ms-client-principal-id'];

    if (req.body && req.body.bathersPreference) {
        // Add the preference to the table
        const connString = process.env.AzureWebJobsStorage;
        const tableService = azure.createTableService(connString);
        const entGen = azure.TableUtilities.entityGenerator;
        const entity = {
            PartitionKey: entGen.String(userId),
            RowKey: entGen.String(userId),
            bathers: entGen.String(req.body.bathersPreference),
        };
        await new Promise((resolve, reject) => {
            tableService.insertOrReplaceEntity(process.env.storage_table_name, entity, function (error, result, response) {
                if (!error) {
                    resolve({ result, response });
                } else {
                    reject(error);
                }
            });
        });

        context.res = {
            body: JSON.stringify({ result: true })
        };
    }
    else {
        // Need to pass in the bathersPreference
        context.res = {
            status: 400,
            body: JSON.stringify({ result: false, error: "Please pass in the bathersPreference", requestBody: req.body })
        };
    }

};