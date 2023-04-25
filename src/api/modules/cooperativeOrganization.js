import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  // 机构准入设置
  configList: `GET /upms/client/config/list`, // 列表
  configAdd: `POST /upms/client/config/add`, // 新增配置
  configUpdate: `POST /upms/client/config/update`, // // 修改配置
  configDelete: `GET /upms/client/config/delete`, // 删除配置
  configTmplDel: `GET /upms/client/config/tmpl/del`, // 删除准入审批流程节点
  configTmplList: `GET /upms/client/config/tmpl/list`, // 准入审批流程列表
  configTmplSave: `POST /upms/client/config/tmpl/save`, // 新增修改准入审批流程节点
  clientEmployeeList: `GET /upms/client/dict/employee/list`, // 员工列表
  configFieldList: `GET /upms/client/config/field/list`, // 准入资料配置-列表
  configFiledUpdate: `POST /upms/client/config/filed/update`, // 准入资料配置-保存

  // 合作机构选项设置
  optionList: `GET /upms/client/option/list`, // 列表
  optionSave: `POST /upms/client/option/save`, // 添加-更新下拉选项

  // 准入审批
  registerAuditList: `POST /upms/client/register/audit/list`, // 审批列表
  registerAuditApproveProgress: `GET upms/client/register/audit/approve/progress`, // 审批进程
  registerAuditDetail: `GET /upms/client/register/audit/detail`, // 准入信息
  registerAuditApprove: `POST /upms/client/register/audit/approve`, // 审批

  // 合规审批
  registerAuditComplianceList: `POST /upms/client/register/audit/compliance/list`, // 审批列表
  registerAuditComplianceApproveProgress: `GET upms/client/register/audit/compliance/approve/progress`, // 审批进程
  registerAuditComplianceDetail: `GET /upms/client/register/audit/compliance/detail`, // 准入信息
  registerAuditComplianceApproveJump: `GET /upms/client/register/audit/compliance/approve/jump`, // 跳转合规审批
  registerAuditComplianceApprove: `POST /upms/client/register/audit/compliance/approve`, // 合规审批

  // 所有准入审批工单
  registerAuditAllList: `POST /upms/client/register/audit/all/list`, // 审批列表
  registerAuditAllApproveProgress: `GET upms/client/register/audit/all/approve/progress`, // 审批进程
  registerAuditAllDetail: `GET /upms/client/register/audit/all/detail`, // 准入信息

  // 机构名录
  registerCreateUrl: `POST /upms/client/register/create/url`, // 生成邀请链接
  registerTenantGetByPhone: `GET /upms/client/register/tenant/getByPhone`, // 机构下拉列表
  registerTenantGetRecommendOrg: `POST /upms/client/register/tenant/getRecommendOrg`, // 获取推荐机构列表
  clientOrgList: `POST /upms/client/org/list`, // 机构名录列表
  clientOrgDetail: `GET /upms/client/org/detail`, // 机构详情
  clientOrgOpenCooperation: `POST /upms/client/org/openCooperation`, // 开启合作
  clientOrgTerminateCooperation: `POST /upms/client/org/terminateCooperation`, // 终止合作
  clientOrgSetStopJob: `POST /upms/client/org/setStopJob` // 设置是否暂停作业
}

const apis = generateApiFnc(apiConfig)
export default apis
