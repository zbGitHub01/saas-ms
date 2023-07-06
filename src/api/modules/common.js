import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  findRegisterUserList: `GET /upms/client/dict/register/userList`, // 下拉注册人名称列表
  findConfigList: `GET /upms/client/dict/config/list`, // 机构准入配置下拉列表
  findItemList: `GET /upms/client/dict/item/list`, // 查询字典项
  // 省市区
  areaTree: `GET /upms/client/dict/area/tree`,
  //获取单项值
  findSingleInfo: `GET /upms/client/dict/single/info`,
  // 字典列表接口
  dictManageList: `GET /upms/client/dict/manage/list`,
  // 字典新增/修改接口
  dictManageSave: 'POST /upms/client/dict/manage/save',
  // 字典删除接口
  dictManageDel: `DELETE /upms/client/dict/manage/delete`,
}

const apis = generateApiFnc(apiConfig)
export default apis
