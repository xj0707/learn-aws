
const jwt = require('jsonwebtoken')
const BaseModel = require('./model/BaseModel')
const responseTemplate = require('./util/util').responseTemplate
const JSONParser = require('./util/util').JSONParser
const TOKEN_SECRET = 'leo'

/**
 * 用户登录测试接口
 */
exports.handler = async (e, c, cb) => {
    try {
        //获取入参
        let inparam = JSONParser(e.body)
        //参数校验
        if (!inparam.userName || !inparam.userPwd) {
            return responseTemplate({ message: '入参不完整', code: '10001' })
        }
        //获取用户
        let res = await new BaseModel().query({
            TableName: 'TT_User',
            IndexName: 'userNameIndex',
            KeyConditionExpression: 'userName =:userName',
            ExpressionAttributeValues: {
                ':userName': inparam.userName
            }
        })
        console.log(res)
        if (res.Items.length == 0) {
            return responseTemplate({ message: '用户不存在', code: '10002' })
        }
        let userInfo = res.Items[0]
        //密码校验
        if (userInfo.userPwd != inparam.userPwd) {
            return responseTemplate({ message: '密码不正确', code: '10003' })
        }
        //更新 登录状态 和时间
        new BaseModel().updateItem({
            Key: { userId: userInfo.userId },
            UpdateExpression: 'SET loginState = :loginState,loginAt=:loginAt',
            ExpressionAttributeValues: {
                ':loginState': 1,
                ':loginAt': Date.now
            }
        })
        //生成token
        let loginToken = jwt.sign({ userName: userInfo.userName, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 }, TOKEN_SECRET)
        let data = {
            token: loginToken,
            userId: userInfo.userId,
            userName: userInfo.userName
        }
        return responseTemplate({ message: '操作成功', payload: data, code: '0' })
    } catch (error) {
        console.log(error)
        return responseTemplate({ message: '服务器错误', payload: error, code: '500' })
    }
}


