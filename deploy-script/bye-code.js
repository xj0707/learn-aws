exports.handler = function (event, context, callback) {
    var foo = event.foo;
    var bar = event.bar;
    var result = MyLambdaFunction(foo, bar);

    callback(null, result);
}

function MyLambdaFunction(foo, bar) {
    return response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        },
        "body": { message: '同步函数' }
    };
}