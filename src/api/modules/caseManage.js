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
    productList: 'GET /caseCenter/product/list', //不分页获取产品下拉列表(当前租户)
    // 入库批次
    batchPage: 'GET /caseCenter/batch/page', //分页查询
    batchAdd: 'POST /caseCenter/batch/add', //新增入库批次
    batchEdit: 'PUT /caseCenter/batch/edit', //修改入库批次
    batchInfoList: 'POST /caseCenter/batch/info/batchInfoList', //入库批次详情批量
    productIds: 'POST /caseCenter/batch/info/productIds', //通过产品Ids获取批次ID及批次号
    batchList: 'GET /caseCenter/batch/list', //入库批次下拉
    
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

    // 全部案件
    caseList: 'POST /caseCenter/case/list', //全部案件列表
    caseListStats: 'POST /caseCenter/case/list/stats', //全部案件列表统计数据
    caseStatusUpdate: 'POST /caseCenter/case/status/update', //暂停关闭恢复案件
    caseLock: 'POST /caseCenter/case/lock', //案件锁定
    caseExport: 'POST /caseCenter/case/export', //导出案件
    generateCertificate: 'POST /caseCenter/case/generate/certificate', //生成结清证明
    updateColor: 'POST /caseCenter/case/update/color', //案件标色
    updateFollowStatus: 'POST /caseCenter/case/update/followStatus', //案件处置状态修改
    orgTagTempAdd: 'POST /caseCenter/case/orgTagTemp/add', //临时标签添加
    orgTagTempDelete: 'POST /caseCenter/case/orgTagTemp/delete', //删除标签添加
    orgTagTempList: 'GET /caseCenter/case/orgTagTemp/list', //临时标签列表
    followExport: 'POST /caseCenter/follow/export', //导出处置记录
    companyCaseExport: 'POST /caseCenter/org/companyCase/export', //委派处置-导出案件

    // 委案管理
    entrustCaseList: 'POST /caseCenter/case/entrust/entrustCaseList', //实时委案案件列表
    entrustCaseListStats: 'POST /caseCenter/case/entrust/entrustCaseList/stats', //实时委案案件列表统计数
    caseEntrustSelect: 'POST /caseCenter/case/entrust/caseEntrustSelect', //发起委案 查询
    caseAllotRefresh: 'POST /caseCenter/case/entrust/caseAllotRefresh', //发起委案 刷新
    caseEntrustSave: 'POST /caseCenter/case/entrust/caseEntrustSave', //发起委案 保存
    recoverCaseList: 'POST /caseCenter/case/recover/recoverCaseList', //实时委案收回案件列表
    recoverCaseListStats: 'POST /caseCenter/case/recover/recoverCaseList/stats', //实时委案收回案件列表统计数
    recoverNowSelect: 'POST /caseCenter/case/recover/recoverNowSelect', //实时收回 查询
    recoverNowSave: 'POST /caseCenter/case/recover/recoverNowSave', //实时收回 保存
    recoverRecordList: 'POST /caseCenter/case/recover/recoverRecordList', //实时收回列表

    // 资产包类型
    packagetypeList: 'GET /caseCenter/packagetype/list', //不分页资产包类型
    // 债权方列表
    dictCreditorList: 'GET /upms/client/dict/creditor/list', 
    // 获取租户合作机构
    relationOrgList: 'GET /upms/client/dict/relationOrg/list',  
    // 获取租户-部门下员工列表
    empolyeeList: 'GET /upms/client/dict/empolyee/list',
}

// 删除产品名录
export const productDel = id => {
  return http.delete(`/caseCenter/product/${id}`)
}
// 删除入库批次
export const batchDel = id => {
    return http.delete(`/caseCenter/batch/${id}`)
}
// 终止委托
export const proxyStop = batchId => {
    return http.post('/caseCenter/case/proxy/stop', `batchId=${batchId}`)
}

const apis = generateApiFnc(apiConfig)
export default apis