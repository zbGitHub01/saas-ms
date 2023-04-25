<template>
  <div class="detail-content-wrap">
    <div v-for="(item, index) in detailInfoProp" :key="index">
      <div class="item-wrap">
        <div
          class="item-name"
          v-if="item.prop === 'noCriminal' ? props.jobName === 'legal_person' || props.jobName === 'control_person' : true"
        >
          {{ item.name }}
          <!--TODO:zqg 判断身份证命中黑名单  -->
          <span
            class="error-tips"
            v-if="item.prop === 'idNumber' && !!isShowBlacklist(props.infoData[item.prop]).length"
          >
            <span
              style="margin-left: 6px"
              v-for="(item, index) in isShowBlacklist(props.infoData[item.prop])"
              :key="index"
            >{{ item.hitTypeName }}</span>
          </span>
        </div>
        <div
          v-if="
            item.prop === 'businessLicense'
              ? props.infoData.businessLicense && props.infoData.businessLicense.length > 0
              : item.prop === 'idNumber'
              ? props.infoData.idNumber || props.infoData.idFront || props.infoData.idBack
              : (props.infoData[item.prop] && props.infoData[item.prop] != '[]') ||
                (props.infoData[item.prop1] && props.infoData[item.prop1] != '[]') ||
                props.infoData[item.prop] === 0
          "
        >
          <div v-if="item.type === 'text'" class="item-text">
            {{ props.infoData[item.prop] }}
            <error-tooltip v-if="isSensitiveInfo(item.sensitivityCode)" text="命中敏感机构信息" />
          </div>
          <div
            v-if="
              item.prop === 'noCriminal' ? jobName === 'legal_person' || jobName === 'control_person' : item.type === 'bigImg'
            "
          >
            <el-image
              class="item-big-img"
              :src="props.infoData[item.prop]"
              :preview-src-list="[props.infoData[item.prop]]"
            ></el-image>
          </div>
          <div v-if="item.type === 'smallImg'">
            <el-image
              v-for="(smallImgItem, smallImgIndex) in jsonArrayText(item.prop)"
              :key="smallImgIndex + 'img' + item.prop"
              class="item-small-img"
              :src="smallImgItem.url"
              :preview-src-list="previewList(jsonArrayText(item.prop))"
            ></el-image>
          </div>
          <div v-if="item.type === 'imgFile'">
            <div v-if="jsonArrayText(item.prop)[0]">
              <el-image
                v-for="(imgItem, imgIndex) in jsonArrayText(item.prop)[0]"
                :key="imgIndex + 'img' + item.prop"
                class="item-small-img"
                :src="imgItem.url"
                :preview-src-list="previewList(jsonArrayText(item.prop)[0])"
              ></el-image>
            </div>
            <div v-if="jsonArrayText(item.prop)[1]">
              <div
                v-for="(fileItem, fileIndex) in jsonArrayText(item.prop)[1]"
                :key="fileIndex + 'file' + item.prop"
                class="item-small-file"
                @click="onExport(fileItem.url)"
              >{{ fileItem.name }}</div>
            </div>
          </div>
          <div v-if="item.type === 'textImg'">
            <div v-if="props.infoData[item.prop]" class="item-text">{{ props.infoData[item.prop] }}</div>
            <div v-if="props.infoData[item.prop1]" class="pt10">
              <el-image
                v-for="(imgItem, imgIndex) in jsonArrayText(item.prop1)"
                :key="imgIndex + 'img' + item.prop"
                class="item-small-img"
                :src="imgItem.url"
                :preview-src-list="previewList(jsonArrayText(item.prop1))"
              ></el-image>
            </div>
          </div>
          <div v-if="item.type === 'file'">
            <div
              v-for="(fileItem, fileIndex) in jsonArrayText(item.prop)"
              :key="fileIndex + 'file' + item.prop"
              class="item-small-file"
              @click="onExport(fileItem.url)"
            >{{ fileItem.name }}</div>
          </div>
          <div v-if="item.type === 'textFile'">
            <div v-if="props.infoData[item.prop]" class="item-text">{{ props.infoData[item.prop] }}</div>
            <div v-if="props.infoData[item.prop1]" class="pt10">
              <div
                v-for="(fileItem, fileIndex) in jsonArrayText(item.prop1)"
                :key="fileIndex + 'file' + item.prop"
                class="item-small-file"
                @click="onExport(fileItem.url)"
              >{{ fileItem.name }}</div>
            </div>
          </div>
          <!-- 固定IP地址 -->
          <div v-if="item.type === 'ipAddress'" class="item-text">
            <span
              style="
                margin-right: 12px;
                word-break: normal;
                display: inline-block;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow: hidden;
                width: 500px;
              "
            >{{ props.infoData[item.prop] }}</span>
          </div>
          <!-- 处置业务运营开始时间 -->
          <div v-if="item.type === 'time'" class="item-text">{{ timetrans(item.prop) }}</div>
          <!-- 身份证 -->
          <div v-if="item.type === 'idCard'">
            <div class="item-text mb10">
              {{ props.infoData.idNumber }}
              <error-tooltip v-if="isSensitiveInfo(6, props.infoData.idNumber)" text="命中敏感机构信息" />
            </div>
            <el-image
              v-if="props.infoData.idFront"
              class="item-big-img mr40"
              :src="props.infoData.idFront"
              :preview-src-list="[props.infoData.idFront]"
            ></el-image>
            <el-image
              v-if="props.infoData.idBack"
              class="item-big-img"
              :src="props.infoData.idBack"
              :preview-src-list="[props.infoData.idBack]"
            ></el-image>
          </div>
          <!-- 办公地点 -->
          <div v-if="item.type === 'address'" class="item-text">
            {{
            `${props.infoData.provinceName || ''} ${props.infoData.cityName || ''} ${props.infoData.areaName || ''} ${
            props.infoData.address || ''
            }`
            }}
          </div>
          <!--主要岗位职责、合作机构和产品 -->
          <div v-if="item.type === 'json'">
            <div v-if="item.prop === 'mainJobResponsibilities'">
              <div
                v-for="(jobItem, jobIndex) in jsonArrayText(item.prop)"
                :key="jobIndex + 'job' + item.prop"
                class="mb20"
              >
                <div class="item-text">{{ jobItem.job }}</div>
                <div class="item-text mt10">{{ jobItem.responsibilities }}</div>
              </div>
            </div>
            <div v-if="item.prop === 'orgProductJson'">
              <div
                v-for="(orgItem, orgIndex) in jsonArrayText(item.prop)"
                :key="orgIndex + 'org' + item.prop"
                class="mb6 item-text"
              >{{ orgItem.orgName }} {{ orgItem.productName }} {{ orgItem.age.join('，') }}</div>
            </div>
          </div>
          <!-- 安防监控配备 -->
          <div v-if="item.type === 'monitorInfo'">
            <div class="item-text" style="display: flex">
              <div style="width: 280px; color: #999">1.贵司所有出入口是否有装备摄像头</div>
              <div style="color: #333; flex: 1">{{ monitorInfoText('entranceMonitor') }}</div>
            </div>
            <div class="item-text" style="display: flex">
              <div style="width: 280px; color: #999">2.生产作业区域是否有装备摄像头</div>
              <div style="color: #333; flex: 1">{{ monitorInfoText('workMonitor') }}</div>
            </div>
            <div class="item-text" style="display: flex">
              <div style="width: 280px; color: #999">3.设备机房或设备区域是否有装备摄像头</div>
              <div style="color: #333; flex: 1">{{ monitorInfoText('equipmentMonitor') }}</div>
            </div>
            <div class="item-text" style="display: flex">
              <div style="width: 280px; color: #999">4.是否实施24小时监控且全面无死角</div>
              <div style="color: #333; flex: 1">{{ monitorInfoText('allDayMonitor') }}</div>
            </div>
            <div class="item-text" style="display: flex">
              <div style="width: 280px; color: #999">5.监控录像保存时限</div>
              <div style="color: #333; flex: 1">{{ monitorInfoText('keepTime') }}小时</div>
            </div>
            <div class="item-text" style="display: flex">
              <div style="width: 280px; color: #999">6.其他补充说明</div>
              <div style="color: #333; flex: 1">{{ monitorInfoText('monitorRemark') }}</div>
            </div>
          </div>
          <div
            v-if="item.type === 'check' && props.infoData[item.prop] === 1"
            class="item-text"
          >无风险管理、信息系统安全(网络安全)、数据安全等相关证书</div>
          <!-- 财务相关信息 -->
          <div v-if="item.type === 'account'">
            <div class="item-text">开户行：{{ props.infoData.bank }}</div>
            <div class="item-text">账户名：{{ props.infoData.accountName }}</div>
            <div class="item-text">
              账号：{{ props.infoData.accountNumber }}
              <error-tooltip v-if="isSensitiveInfo(4)" text="命中敏感机构信息" />
            </div>
          </div>
          <div v-if="item.type === 'tax'" class="item-text">
            税务登记号：{{ props.infoData[item.prop] }}
            <error-tooltip v-if="isSensitiveInfo(3)" text="命中敏感机构信息" />
          </div>
        </div>
        <div v-else class="text-empty">
          {{
          item.prop === 'noCriminal' && props.jobName !== 'legal_person' && props.jobName !== 'control_person' ? '' : '暂无内容'
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ErrorTooltip from '../ErrorTooltip.vue'
import { downloadFile } from '@/utils'
// 接收props数据
const props = defineProps<{
  tabActive: {
    type: number
  }
  infoData: {
    type: Object
    default: () => {}
  }
  detailData: {
    type: Object
    default: () => {}
  }
  jobName: {
    type: String
  }
  hitList: {
    type: []
  }
}>()
// sensitivityCode 字段为敏感库类型
const infoMap = new Map([
  [
    1,
    [
      {
        prop: 'companyProfile',
        name: '公司简介',
        type: 'text'
      },
      {
        prop: 'businessTime',
        name: '处置业务运营开始时间',
        type: 'time'
      },
      {
        prop: 'ipAddress',
        name: '固定IP地址',
        type: 'ipAddress'
      },
      {
        prop: 'accessCertificate',
        name: '入网证明',
        type: 'smallImg'
      },
      {
        prop: 'businessLicense',
        name: '营业执照',
        type: 'smallImg'
      },
      {
        prop: 'socialCreditCode',
        name: '统一社会信用代码',
        type: 'text',
        sensitivityCode: 2
      },
      {
        prop: 'orgChart',
        name: '组织架构',
        type: 'bigImg'
      },
      {
        prop: 'mainJobResponsibilities',
        name: '主要岗位职责',
        type: 'json'
      },
      {
        prop: 'companyPeople',
        name: '公司人数',
        type: 'text'
      },
      {
        prop: 'companyCulture',
        name: '公司文化',
        type: 'text'
      }
    ]
  ],
  [
    2,
    [
      {
        prop: 'username',
        name: '姓名',
        type: 'text'
      },
      {
        prop: 'userPhone',
        name: '联系电话',
        type: 'text'
      },
      {
        prop: 'idNumber',
        name: '身份证',
        type: 'idCard'
      },
      {
        prop: 'noCriminal',
        name: '无犯罪记录证明',
        type: 'bigImg'
      },
      {
        prop: 'laborUrl',
        name: '劳动合同及保密协议扫描件',
        type: 'imgFile'
      },
      {
        prop: 'socialCertificate',
        name: '社保缴纳证明',
        type: 'bigImg'
      },
      {
        prop: 'workHistory',
        name: '工作履历',
        type: 'text'
      }
    ]
  ],
  [
    3,
    [
      {
        prop: 'provinceName',
        name: '办公地点',
        type: 'address'
      },
      {
        prop: 'environmentUrl',
        name: '场地环境照片',
        type: 'smallImg'
      },
      {
        prop: 'contractUrl',
        name: '办公场地租赁合同',
        type: 'imgFile'
      }
    ]
  ],
  [
    4,
    [
      {
        prop: 'orgProductJson',
        name: '合作机构和产品',
        type: 'json'
      },
      {
        prop: 'cooperationUrl',
        name: '合作证明',
        type: 'imgFile'
      }
    ]
  ],
  [
    5,
    [
      {
        prop: 'hardware',
        prop1: 'hardwareUrl',
        name: '硬件设施',
        type: 'textImg'
      },
      {
        prop: 'monitorInfo',
        name: '安防监控配备',
        type: 'monitorInfo'
      },
      {
        prop: 'software',
        prop1: 'certificatesUrl',
        name: '软件技术',
        type: 'textImg'
      },
      {
        prop: 'isCertificate',
        name: '',
        type: 'check'
      }
    ]
  ],
  [
    6,
    [
      {
        prop: 'systemUrl',
        name: '招聘制度',
        type: 'file'
      },
      {
        prop: 'registerUrl',
        name: '公司花名册',
        type: 'file'
      },
      {
        prop: 'training',
        prop1: 'trainingUrl',
        name: '培训制度',
        type: 'textFile'
      },
      {
        prop: 'checkName',
        prop1: 'checkUrl',
        name: '处置稽核制度',
        type: 'textFile'
      },
      {
        prop: 'reformPlan',
        prop1: 'reformPlanUrl',
        name: '内部整改方案',
        type: 'textFile'
      },
      {
        prop: 'complaint',
        prop1: 'complaintUrl',
        name: '投诉处理制度',
        type: 'textFile'
      },
      {
        prop: 'securityName',
        prop1: 'securityUrl',
        name: '信息安全保密机制',
        type: 'textFile'
      },
      {
        prop: 'emergency',
        prop1: 'emergencyUrl',
        name: '突发事件应急预案和机制',
        type: 'textFile'
      },
      {
        prop: 'phoneManage',
        prop1: 'phoneManageUrl',
        name: '手机管理制度',
        type: 'textFile'
      }
    ]
  ],
  [
    7,
    [
      {
        prop: 'operationDisposalProcess',
        prop1: 'operationDisposalProcessUrl',
        name: '作业处置流程',
        type: 'textFile'
      },
      {
        prop: 'complaintHandlingProcess',
        prop1: 'complaintHandlingProcessUrl',
        name: '投诉案件处置流程',
        type: 'textFile'
      }
    ]
  ],
  [
    8,
    [
      {
        prop: 'bank',
        name: '对公账户',
        type: 'account'
      },
      {
        prop: 'taxNo',
        name: '开票信息',
        type: 'tax'
      }
    ]
  ],
  [
    9,
    [
      {
        prop: 'advantage',
        name: '公司优势',
        type: 'text'
      }
    ]
  ]
])
const onExport = (url: string) => {
  downloadFile(url)
}
const isSensitiveInfo = (type, value) => {
  if (!props.detailData || !type) return false
  const { sensitiveOrgHitList } = props.detailData
  if (!sensitiveOrgHitList) {
    return false
  }
  if (type === 5 || type === 6) {
    return !!sensitiveOrgHitList.find(item => item.hitItem === value)
  }
  return !!sensitiveOrgHitList.find(item => item.hitType === type)
}
const isShowBlacklist = (idNo: number) => {
  if (!props.hitList || !props.hitList.length) {
    return []
  }
  return props.hitList.filter((item: any) => item.idNo === idNo + '')
}
const detailInfoProp = computed(() => infoMap.get(Number(props.tabActive)))
const monitorInfoText = computed(() => {
  return (val: any) => {
    const monitorInfo = props.infoData.monitorInfo ? eval('(' + props.infoData.monitorInfo + ')') : {}
    return val === 'keepTime' || val === 'monitorRemark' ? monitorInfo[val] : monitorInfo[val] === 0 ? '否' : '是'
  }
})
const jsonArrayText = computed(() => {
  return (val: any) => {
    return props.infoData[val]
      ? Array.isArray(props.infoData[val])
        ? props.infoData[val]
        : eval('(' + props.infoData[val] + ')')
      : []
  }
})
const previewList = computed(() => {
  return (val: any) => {
    return Array.from(val, ({ url }) => url)
  }
})
const timetrans = computed(() => {
  return (val: any) => {
    let date = new Date(props.infoData[val]) //如果date为13位不需要乘1000
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
  }
})
</script>

<style lang="scss" scoped>
.w740 {
  width: 620px !important;
}
.w350 {
  width: 360px !important;
}
.pt10 {
  padding-top: 10px;
}
.mt10 {
  margin-top: 10px;
}
.mb6 {
  margin-bottom: 6px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
.mr20 {
  margin-right: 20px;
}
.mr40 {
  margin-right: 40px;
}
.width-auto {
  width: auto !important;
}
.text-empty {
  font-size: 18px;
  color: #666666;
  line-height: 24px;
}
.detail-content-wrap {
  overflow-y: auto;
  flex: 1;
  padding-top: 20px;
  .item-wrap {
    margin-bottom: 40px;
  }
  .item-name {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    line-height: 28px;
    margin-bottom: 10px;
  }
  .item-text {
    width: 650px;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
  }
  .item-big-img {
    width: 360px;
    height: 190px;
    border-radius: 2px;
    border: 1px solid #ced2d9;
  }
  .item-small-img {
    width: 142px;
    height: 110px;
    border-radius: 2px;
    border: 1px solid #ced2d9;
    margin: 0 20px 10px 0;
  }
  .item-small-file {
    width: 142px;
    height: 50px;
    padding: 0 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid #ced2d9;
    margin: 0 20px 20px 0;
    line-height: 50px;
    color: #333;
  }
}
.ip-has {
  display: inline-block;
  font-size: 14px;
  color: #f00;
  background: url('~@/assets/material/ip-has.png') no-repeat;
  width: 108px;
  height: 24px;
  padding-left: 16px;
}
.ip-no {
  display: inline-block;
  font-size: 14px;
  color: #09f;
  background: url('~@/assets/material/ip-no.png') no-repeat;
  width: 108px;
  height: 24px;
  padding-left: 16px;
}
.error-tips {
  color: #f56c6c;
  font-size: 12px;
  font-weight: normal;
  margin-left: 2px;
}
</style>
