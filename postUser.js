const BaseModel = require('./model/BaseModel')
const responseTemplate = require('./util/util').responseTemplate
const uuid = require('uuid/v4')
const JSONParser = require('./util/util').JSONParser

exports.handler = async (e, c, cb) => {
    try {
        let inparam = JSONParser(e.body)
        if (!inparam.userName || !inparam.userPwd) {
            return responseTemplate({ message: '入参不完整', code: '10001' })
        }
        let putParms = {
            userName: inparam.userName,
            userId: uuid(),
            userPwd: inparam.userPwd,
            loginState: 1,
            sex: inparam.sex || 1,
            wallet: 0,
            email: inparam.email || 'xx@xx.com',
            nickName: inparam.nickName || `user${Math.floor(Math.random() * 100000)}`,
            loginAt: Date.now(),
            createAt: Date.now()
        }
        let info = await new BaseModel().db$('put', { TableName: 'TT_User', Item: putParms })
        return responseTemplate({ message: '操作成功', code: '0' })
    } catch (error) {
        console.log(error)
        return responseTemplate({ message: '服务器错误', payload: error, code: '500' })
    }
}