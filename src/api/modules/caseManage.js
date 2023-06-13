import { generateApiFnc } from '@/api/helper/apiFncs'
import http from '../index'

const apiConfig = {
    // 案件导入
    caseImport: 'POST /caseCenter/caseImport', //案件导入
    importExcelPath: 'GET /caseCenter/caseImport/importExcelPath', // 获取案件导入模板地址

    // 资产基础配置
    // 产品名录
    productPage: 'GET /caseCenter/product/page', //分页查询
    productAdd: 'POST /caseCenter/product/add', //新增产品目录
    productEdit: 'PUT /caseCenter/product/edit', //修改产品目录
    productCreditorList: 'GET /caseCenter/product/creditor/list', //产品债权方信息列表
    productGetProducts: 'GET /caseCenter/product/get-products', //获取债权方产品列表
    productList: 'GET /caseCenter/product/list', //获取债权方产品列表
    // 入库批次
    batchPage: 'GET /caseCenter/batch/page', //分页查询
    batchAdd: 'POST /caseCenter/batch/add', //新增入库批次
    batchEdit: 'PUT /caseCenter/batch/edit', //修改入库批次
    batchInfoList: 'POST /caseCenter/batch/info/batchInfoList', //入库批次详情批量
    productIds: 'POST /caseCenter/batch/info/productIds', //通过产品Ids获取批次ID及批次号
    // 债权方
    creditorPage: 'GET /caseCenter/creditor/page', //分页查询
    creditorAdd: 'POST /caseCenter/creditor/add', //新增债权方
    creditorEdit: 'PUT /caseCenter/creditor/edit', //修改债权方
    creditorInfoByIdList: 'POST /caseCenter/creditor/info/creditorInfoByIdList', //债权方详情批量

    // 资产委托
    proxyPage: 'GET /caseCenter/case/proxy/page', //分页查询
    proxyCreate: 'POST /caseCenter/case/proxy/create', //新增委托

    // 分库管理
    waitDistCaseList: 'POST /caseCenter/case/dist/waitDistCaseList', //待分配库列表
    waitDistCaseListStats: 'POST /caseCenter/case/dist/waitDistCaseList/stats', //待分配库统计
    doneDistCaseList: 'POST /caseCenter/case/dist/doneDistCaseList', //已分配库列表
    doneDistCaseListStats: 'POST /caseCenter/case/dist/doneDistCaseList/stats', //已分配库统计
    distRecordList: 'POST /caseCenter/case/dist/distRecordList', //分库记录
    caseDistSelect: 'POST /caseCenter/case/dist/caseDistSelect', //发起分库-查询
    caseDistSave: 'POST /caseCenter/case/dist/caseDistSave', //发起分库-保存
    tagTempAdd: 'POST /caseCenter/case/tagTemp/add', //临时标签添加
    tagTempDelete: 'POST /caseCenter/case/tagTemp/delete', //删除标签添加
    tagTempList: 'GET /caseCenter/case/tagTemp/list', //临时标签列表
    
    // 资产包类型
    packagetypeList: 'GET /caseCenter/packagetype/list', //不分页资产包类型

}

// 删除产品名录
export const productDel = id => {
  return http.delete(`/caseCenter/product/${id}`)
}
// 删除入库批次
export const batchDel = id => {
    return http.delete(`/caseCenter/batch/${id}`)
}
// 删除债权方
export const creditorDel = id => {
    return http.delete(`/caseCenter/creditor/${id}`)
}
// 终止委托
export const proxyStop = batchId => {
    return http.post('/caseCenter/case/proxy/stop', `batchId=${batchId}`)
}

const apis = generateApiFnc(apiConfig)
export default apis