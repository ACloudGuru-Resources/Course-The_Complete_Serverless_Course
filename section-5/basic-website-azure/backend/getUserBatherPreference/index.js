module.exports = async function (context, req, preferenceTable) {

    console.log(context.bindings)

    if (!preferenceTable) {
        context.res = {
            body: JSON.stringify({
                found: false
            })
        }
    } else {
        context.res = {
            body: JSON.stringify({
                found: true,
                data: preferenceTable.bathers
            })
        }
    }

};