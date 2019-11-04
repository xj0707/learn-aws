const BaseModel = require('./model/BaseModel')
const responseTemplate = require('./util/util').responseTemplate
const JSONParser = require('./util/util').JSONParser

exports.handler = async (e, c, cb) => {
    try {
        console.log(e)
        let inparam = JSONParser(e.queryStringParameters || {})
        console.log(inparam)
        let res = await new BaseModel().query({
            TableName: 'TT_User',
            IndexName: 'userNameIndex',
            KeyConditionExpression: 'userName =:userName',
            ExpressionAttributeValues: {
                ':userName': inparam.userName
            }
        })
        if (res.Items.length) {
            return responseTemplate({ message: '操作成功', payload: res.Items, code: '0' })
        } else {
            return responseTemplate({ message: '操作失败', payload: res, code: '400' })
        }
    } catch (error) {
        console.log(error)
        return responseTemplate({ message: '服务器错误', payload: error, code: '500' })
    }
}