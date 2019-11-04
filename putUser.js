const BaseModel = require('./model/BaseModel')
const responseTemplate = require('./util/util').responseTemplate
const JSONParser = require('./util/util').JSONParser

exports.handler = async (e, c, cb) => {
    try {
        console.log(e.body)
        let inparam = JSONParser(e.body)
        await new BaseModel().updateItem({
            Key: { userId: inparam.userId },
            UpdateExpression: 'SET userPwd = :userPwd',
            ExpressionAttributeValues: {
                ':userPwd': inparam.userPwd
            }
        })
        return responseTemplate({ message: '操作成功', code: '0' })
    } catch (error) {
        console.log(error)
        return responseTemplate({ message: '服务器错误', payload: error, code: '500' })
    }
}