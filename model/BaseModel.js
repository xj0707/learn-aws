const AWS = require('aws-sdk')
const dbClient = new AWS.DynamoDB.DocumentClient()

/**
 * 基础数据库操作类
 * putItem:插入单项
 * batchWrite:批量插入
 * updateItem:更新单项
 * deleteItem:删除单项
 * isExist:是否存在
 * queryOnce:单次查询
 * query:递归查询
 * scan:递归扫描
 * page:分页
 * bindFilterQuery:绑定筛选参数并查询
 * bindFilterScan:绑定筛选参数并扫描
 */
class BaseModel {
    /**
     * 构造方法，设置基础对象属性
     */
    constructor() {
        this.baseitem = {
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    }

    /**
     * 数据库操作流对象
     * @param {*} action 
     * @param {*} params 
     */
    db$(action, params) {
        return dbClient[action](params).promise()
    }

    /**
     * 插入单项
     * @param {*} item
     */
    putData(item) {
        return this.db$('put', item).then((res) => {
            return res
        }).catch((err) => {
            console.error(`表${item.TableName}写入失败，重新写入，以下是详细错误信息`)
            console.error(item)            
            console.error(err)
            return this.putData(item)
        })
    }

    /**
     * 插入单项
     * @param {*} item
     */
    putItem(item) {
        // return new Promise((reslove, reject) => {
        const params = {
            ...this.params,
            Item: {
                ...this.baseitem,
                ...item
            }
        }
        return this.db$('put', params).then((res) => {
            return res
        }).catch((err) => {
            console.error(`表${params.TableName}写入失败，重新写入，以下是详细错误信息`)
            console.error(params)
            console.error(err)
            return this.putItem(item)
        })
        // })
    }



    /**
     * 更新单项
     * @param {*} conditions 
     */
    updateItem(conditions) {
        // return new Promise((reslove, reject) => {
        const params = {
            ...this.params,
            ...conditions
        }
        return this.db$('update', params)
        // .then((res) => {
        //     return reslove(res)
        // }).catch((err) => {
        //     return reject(err)
        // })
        // })
    }

    /**
     * 删除单项
     * @param {*} conditions 
     */
    deleteItem(conditions) {
        // return new Promise((reslove, reject) => {
        const params = {
            ...this.params,
            ...conditions
        }
        return this.db$('delete', params)
        // .then((res) => {
        //     return reslove(res)
        // }).catch((err) => {
        //     console.error(err)
        //     return reject(err)
        // })
        // })
    }

    /**
     * 查询是否存在
     * @param {*} conditions 
     */
    isExist(conditions) {
        return new Promise((reslove, reject) => {
            const params = {
                ...this.params,
                ...conditions
            }
            return this.db$('query', params)
                .then((res) => {
                    const exist = res ? true : false
                    return reslove(exist)
                }).catch((err) => {
                    console.error(err)
                    return reject(err)
                })
        })
    }

    /**
     * 主键获取
     * @param {*} conditions 
     */
    getItem(conditions = {}) {
        // return new Promise((reslove, reject) => {
        const params = {
            ...this.params,
            ...conditions
        }
        return this.db$('get', params)
        // .then((res) => {
        //     return reslove(res)
        // }).catch((err) => {
        //     return reject(err)
        // })
        // })
    }

    /**
     * 单次查询
     * @param {*} conditions 
     */
    queryOnce(conditions = {}) {
        // return new Promise((reslove, reject) => {
        const params = {
            ...this.params,
            ...conditions
        }
        return this.db$('query', params)
        // .then((res) => {
        //     return reslove(res)
        // }).catch((err) => {
        //     return reject(err)
        // })
        // })
    }

    /**
     * 递归查询所有数据
     */
    query(conditions = {}) {
        const params = {
            ...this.params,
            ...conditions
        }
        return this.queryInc(params, null)
    }

    // 内部增量查询，用于结果集超过1M的情况
    queryInc(params, result) {
        return this.db$('query', params).then((res) => {
            if (!result) {
                result = res
            } else {
                result.Items.push(...res.Items)
            }
            if (res.LastEvaluatedKey) {
                params.ExclusiveStartKey = res.LastEvaluatedKey
                return this.queryInc(params, result)
            } else {
                return result
            }
        }).catch((err) => {
            console.error(err)
            return err
        })
    }

    /**
     * 全表查询数据
     */
    scan(conditions = {}) {
        const params = {
            ...this.params,
            ...conditions
        }
        return this.scanInc(params, null)
    }

    // 内部增量查询，用于结果集超过1M的情况
    scanInc(params, result) {
        return this.db$('scan', params).then((res) => {
            if (!result) {
                result = res
            } else {
                result.Items.push(...res.Items)
            }
            if (res.LastEvaluatedKey) {
                params.ExclusiveStartKey = res.LastEvaluatedKey
                return this.scanInc(params, result)
            } else {
                return result
            }
        }).catch((err) => {
            console.error(err)
            return err
        })
    }

}


module.exports = BaseModel