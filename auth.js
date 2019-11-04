
const jwt = require('jsonwebtoken')
const TOKEN_SECRET = 'leo'

exports.handler = async function (event, context, callback) {
    let effect = 'Deny'
    const token = event.authorizationToken.split(' ')
    console.log(JSON.stringify(context))
    if (token[0] === 'Bearer') {
        try {
            const userInfo = await jwt.verify(token[1], TOKEN_SECRET)
            effect = 'Allow'
            return context.succeed(generatePolicy(userInfo.userId, effect, event.methodArn, userInfo))
            // return callback(null, generatePolicy(userInfo.userId, effect, event.methodArn, userInfo))
        } catch (e) {
            console.log(e)
            switch (e.message) {
                case 'jwt expired':
                    console.log('token 过期')
                    break;
                case 'invalid signature':
                    console.log('无效的签名')
                    break;
                case 'jwt malformed':
                    console.log('无效的token')
                    break;
                default:
                    console.log('token认证失败')
            }
            return context.succeed(generatePolicy(-1, effect, event.methodArn, {}))
        }
    }
    return context.fail('授权类型错误')
    // return callback(null, generatePolicy('0', effect, event.methodArn, {}))

}
// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource, userInfo) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {};
    authResponse.context.userName = userInfo.userName
    authResponse.context.userId = userInfo.userId

    return authResponse;
}

