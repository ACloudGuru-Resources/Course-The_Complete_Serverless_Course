// https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html
exports.write = function (message) {
    return `From My Logger: ${message}`;
}