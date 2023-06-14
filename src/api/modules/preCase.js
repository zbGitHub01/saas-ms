/**
 * 预委案
 */
import http from '../index'
import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  entrustList: 'GET /caseCenter/case/entrust/entrustPlanList', //entrustBusType: 业务类型（1-实时委案；2-预预案; 3-导入委案; 4-模型委案;）
  entrustSave: 'POST /caseCenter/case/entrust/caseImportEntrustSave', //导入委案保存
  proEntrustSave: 'POST /caseCenter/case/entrust/casePreEntrustSave', //产品委案保存
  entrustListInfo: 'GET /caseCenter/case/entrust/entrustPlanDetail', //委案列表详情
  casePreEntrustCfg: 'POST /caseCenter/case/entrust/casePreEntrustCfg' //产品委案配置保存
}

//发布委案方案
export const entrustPub = ids => {
  return http.get(`/caseCenter/case/entrust/entrustPlanPublish?entrustIds=${ids}`)
}

//删除委案方案
export const delEntrust = ids => {
  return http.get(`/caseCenter/case/entrust/entrustPlanDelete?entrustIds=${ids}`)
}

const apis = generateApiFnc(apiConfig)
export default apis
