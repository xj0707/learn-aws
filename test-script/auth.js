

exports.handler = async function (event, context, callback) {
    let rand=Math.round(Math.random()) 
    console.log('context:',context)
    console.log(`当前随机数是${rand}`)
    if (rand> 0) {
        console.log('认证成功')
        let userInfo = { userName: 'leo' }
        return callback(null, generatePolicy('11', 'Allow', event.methodArn, userInfo))
    } else {
        console.log('认证失败')
        return callback(null, generatePolicy('0', 'Deny', event.methodArn, {}))
    }
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
    return authResponse;
}

