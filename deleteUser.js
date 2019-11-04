const BaseModel = require('./model/BaseModel')
const responseTemplate = require('./util/util').responseTemplate
const JSONParser = require('./util/util').JSONParser
exports.handler = async (e, c, cb) => {
    try {
        let inparam = JSONParser(e.queryStringParameters || {})
        console.log(inparam)
        let res = await new BaseModel().deleteItem({
            TableName: 'TT_User',
            Key: {
                'userId': inparam.userId,
            }
        })
        return responseTemplate({ message: '操作成功', payload: res, code: '0' })
    } catch (error) {
        console.log(error)
        return responseTemplate({ message: '服务器错误', payload: error, code: '500' })
    }
}