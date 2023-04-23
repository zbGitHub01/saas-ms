<template>
  <el-drawer
    v-model="drawer"
    size="1280"
    :direction="direction"
    :before-close="handleClose"
    append-to-body
    class="compliance-detail-drawer"
  >
    <template #default>
      <div style="display: flex; height: 100%">
        <div style="width: 670px">
          <h4>机构详情</h4>
          <div class="approval-type" v-if="props.approveType !== '0'">
            <img
              :src="`/src/assets/images/approval-${Number(props.approveType)}.png`"
              alt="approveType"
            />
          </div>
          <div class="flx-align-center pt10 pb10">
            <div class="mr40">
              <span class="color-999">机构名：</span>
              {{ detailData.companyName }}
            </div>
            <div class="mr40">
              <span class="color-999">注册人姓名：</span>
              {{ detailData.username }}
            </div>
            <div class="mr40">
              <span class="color-999">注册手机号：</span>
              {{ detailData.phone }}
            </div>
          </div>
          <div style="height: calc(100% - 66px)">
            <access-data
              :scrollTop="260"
              accessId="compliance-personal-info"
              :accessDetail="detailData"
              ref="accessDataRef"
            ></access-data>
          </div>
        </div>
        <div class="pl30 pr10">
          <h4>合规判定</h4>
          <div style="height: calc(100% - 20px)">
            <compliance-info v-model:isVisible="drawer" v-if="props.approveType === '0'"></compliance-info>
            <compliance-result v-else></compliance-result>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import accessData from './../../components/accessData/index.vue'
import complianceInfo from './../../components/complianceDeter/info.vue'
import complianceResult from './../../components/complianceDeter/result.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const props = defineProps<{
  approveType: string
}>()
const drawer = ref(false)
const direction = ref('rtl')
const logId = ref()
const detailData = ref({})
const hitList = ref([])
const accessDataRef = ref()
const temddd = {
  logId: 4,
  registerId: null,
  applyId: null,
  companyName: null,
  username: null,
  updateTime: '2023-04-21 15:49:23',
  accessStatus: 0,
  accessStatusName: null,
  jsonMap:
    '{1:{"accessCertificate":"[{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/c304c25c7bc4483e966a790ed3a1ffa0.png\\",\\"uid\\":1682061786050,\\"status\\":\\"success\\"},{\\"name\\":\\"dongan-logo.png\\",\\"url\\":\\"asfile.donganzichan.cn/c27fe8334cc247a3947f6acb10b2d203.png\\",\\"uid\\":1682062966405,\\"status\\":\\"success\\"}]","businessLicense":"[{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/09e36a8cebd14e19a50c31cb740ac3f2.png\\",\\"uid\\":1682061789331,\\"status\\":\\"success\\"},{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/9e1c1e6bf96a42a4bb6854f300a486c4.png\\",\\"uid\\":1682062963407,\\"status\\":\\"success\\"}]","businessTime":1680451200000,"companyCulture":"23242","companyPeople":12,"companyProfile":"这是公司介绍","ipAddress":"121.22.2.2","mainJobResponsibilities":"[{\\"job\\":\\"3232\\",\\"responsibilities\\":\\"3232\\"},{\\"job\\":\\"4444\\",\\"responsibilities\\":\\"4444444\\"}]","orgChart":"asfile.donganzichan.cn/2f1d0b0913c5490ba89f57dab1cff9ee.png","socialCreditCode":"121313"},2:"[{\\"idBack\\":\\"asfile.donganzichan.cn/7987a61ca97946049f64936b44e2a240.png\\",\\"idFront\\":\\"asfile.donganzichan.cn/3bbbd64a4b504302a57a157f9c2f66e8.png\\",\\"idNumber\\":\\"123123123412341234\\",\\"laborUrl\\":\\"[[{\\\\\\"name\\\\\\":\\\\\\"business.png\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/98ce77217b604affb14af94a75cd04db.png\\\\\\",\\\\\\"uid\\\\\\":1682062994789,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"},{\\\\\\"name\\\\\\":\\\\\\"dongan-logo.png\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/1ed1cd9012134721b157bd746a9564c3.png\\\\\\",\\\\\\"uid\\\\\\":1682062999102,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"}],[{\\\\\\"name\\\\\\":\\\\\\"BE-BQ-0008438_代理委托证明.txt\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/66cba1fc8e6d453390d0e547618f94cd.txt\\\\\\",\\\\\\"uid\\\\\\":1682063003511,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"},{\\\\\\"name\\\\\\":\\\\\\"BE-BQ-0001001_仲裁申请书.PDF\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/5692cd2838ee4af18a21ba3080467273.PDF\\\\\\",\\\\\\"uid\\\\\\":1682063006968,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"}]]\\",\\"noCriminal\\":\\"asfile.donganzichan.cn/e7f9df5e20bd423fb9ca6d0cf1eedf25.png\\",\\"peopleType\\":1,\\"socialCertificate\\":\\"asfile.donganzichan.cn/4e51aafc9ff44943abfc61018b2b51d2.png\\",\\"userPhone\\":\\"12111111111\\",\\"username\\":\\"11\\",\\"workHistory\\":\\"11111111\\"},{\\"idBack\\":\\"asfile.donganzichan.cn/82a96db481df4d139ea44f818d7f527b.png\\",\\"idFront\\":\\"asfile.donganzichan.cn/9b319b1a34404704aca30f1f6566ffd9.png\\",\\"idNumber\\":\\"222222222222222222\\",\\"laborUrl\\":\\"[[],[{\\\\\\"name\\\\\\":\\\\\\"BE-BQ-0001001_仲裁申请书.PDF\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/188ad0c1a1984131a5e62f854a29575f.PDF\\\\\\",\\\\\\"uid\\\\\\":1682062659208,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"}]]\\",\\"noCriminal\\":\\"asfile.donganzichan.cn/2da6a638636e49258a672c523f52cb09.png\\",\\"peopleType\\":2,\\"socialCertificate\\":\\"asfile.donganzichan.cn/ca64095c9dab41a888bc1bb69864983b.png\\",\\"userPhone\\":\\"12222222222\\",\\"username\\":\\"22\\",\\"workHistory\\":\\"22222\\"},{\\"idBack\\":\\"\\",\\"idFront\\":\\"\\",\\"idNumber\\":\\"\\",\\"laborUrl\\":\\"[[{\\\\\\"name\\\\\\":\\\\\\"business.png\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/ca8b3e749d124c1a90268e6b51b0f4c4.png\\\\\\",\\\\\\"uid\\\\\\":1682063029942,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"}],[{\\\\\\"name\\\\\\":\\\\\\"BE-BQ-0008438_代理委托证明.txt\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/01a6ff87ff1c42fcae94265fd88d555f.txt\\\\\\",\\\\\\"uid\\\\\\":1682062673554,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"}]]\\",\\"noCriminal\\":\\"\\",\\"peopleType\\":3,\\"socialCertificate\\":\\"\\",\\"userPhone\\":\\"\\",\\"username\\":\\"\\",\\"workHistory\\":\\"333\\"},{\\"idBack\\":\\"asfile.donganzichan.cn/9dfd98ce40a54e94ac1d31d4d2a73ce8.png\\",\\"idFront\\":\\"asfile.donganzichan.cn/286938310c724f78a92fe8ec4df5dbb3.png\\",\\"idNumber\\":\\"444444444444444444\\",\\"laborUrl\\":\\"[[{\\\\\\"name\\\\\\":\\\\\\"business.png\\\\\\",\\\\\\"url\\\\\\":\\\\\\"asfile.donganzichan.cn/7f5ef8ed7c4a4238834f63e86cd5dab2.png\\\\\\",\\\\\\"uid\\\\\\":1682062704086,\\\\\\"status\\\\\\":\\\\\\"success\\\\\\"}],[]]\\",\\"noCriminal\\":\\"\\",\\"peopleType\\":4,\\"socialCertificate\\":\\"asfile.donganzichan.cn/432474d60a934d65bfb8816e2fac0206.png\\",\\"userPhone\\":\\"14444444444\\",\\"username\\":\\"44\\",\\"workHistory\\":\\"4444444\\"}]",3:{"address":"1212121到底","areaId":3105,"areaName":"小店区","cityId":3103,"cityName":"太原市","contractUrl":"[[],[{\\"name\\":\\"BE-BQ-0001001_仲裁申请书.PDF\\",\\"url\\":\\"asfile.donganzichan.cn/31f7b8d91d6443c3ae9e885b3e3b34a5.PDF\\",\\"uid\\":1682060037862,\\"status\\":\\"success\\"}]]","environmentUrl":"[{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/7cb9d1e4241e43d383c7fbed03eb0213.png\\",\\"uid\\":1682063065668,\\"status\\":\\"success\\"},{\\"name\\":\\"dongan-logo.png\\",\\"url\\":\\"asfile.donganzichan.cn/4959fb678b224bf79b7cf4d1b1c32b4e.png\\",\\"uid\\":1682063068714,\\"status\\":\\"success\\"},{\\"name\\":\\"name.png\\",\\"url\\":\\"asfile.donganzichan.cn/f1e6f50a035b47c0822463e1617b4771.png\\",\\"uid\\":1682063072049,\\"status\\":\\"success\\"}]","provinceId":3102,"provinceName":"山西省"},4:{"cooperationUrl":"[[{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/538c4b47f5a84eeda9bdf8bc2ae4f94e.png\\",\\"uid\\":1682061578785,\\"status\\":\\"success\\"}],[{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/3151ab5fe93d4da0b894fd11fcad0464.txt\\",\\"uid\\":1682061574507,\\"status\\":\\"success\\"}]]","orgProductJson":"[{\\"orgName\\":\\"测试1\\",\\"productName\\":\\"11\\",\\"age\\":[\\"M3以内\\",\\"M3～M6\\"]},{\\"orgName\\":\\"1213\\",\\"productName\\":\\"222\\",\\"age\\":[\\"M6~M12\\",\\"M12~M24\\"]}]"},5:{"certificatesUrl":"[{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/8fc54643cdcc4997aa7089bde6bc31a7.png\\",\\"uid\\":1682059900522,\\"status\\":\\"success\\"}]","hardware":"3213121","hardwareUrl":"[{\\"name\\":\\"business.png\\",\\"url\\":\\"asfile.donganzichan.cn/38f3f029d62e41cfa8e94682b8bec963.png\\",\\"uid\\":1682063088416,\\"status\\":\\"success\\"},{\\"name\\":\\"dongan-logo.png\\",\\"url\\":\\"asfile.donganzichan.cn/b3a1f5a552024afb85d0fa3dda344649.png\\",\\"uid\\":1682063091213,\\"status\\":\\"success\\"}]","isCertificate":1,"monitorInfo":"{\\"entranceMonitor\\":0,\\"workMonitor\\":1,\\"equipmentMonitor\\":0,\\"allDayMonitor\\":1,\\"keepTime\\":0,\\"monitorRemark\\":\\"2323咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法23\\"}","software":"3333"},6:{"checkName":"2121212负电荷沙克发","checkUrl":"[]","complaint":"213213","complaintUrl":"[]","emergency":"321313","emergencyUrl":"[]","phoneManage":"32132131","phoneManageUrl":"[]","reformPlan":"发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发","reformPlanUrl":"[{\\"name\\":\\"BE-BQ-0001001_仲裁申请书.PDF\\",\\"url\\":\\"asfile.donganzichan.cn/09a70adc49c647c09116c62aa59cf316.PDF\\",\\"uid\\":1682059459700,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/78dac4ebf5e54dd3b117ef5256eb2559.txt\\",\\"uid\\":1682063130934,\\"status\\":\\"success\\"}]","registerUrl":"[{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/28aeae1f66d74bdda3943d57e2f25857.txt\\",\\"uid\\":1682059449337,\\"status\\":\\"success\\"}]","securityName":"","securityUrl":"[{\\"name\\":\\"BE-BQ-0001001_仲裁申请书.PDF\\",\\"url\\":\\"asfile.donganzichan.cn/42c6cbfdc62a4576a425853a011294a3.PDF\\",\\"uid\\":1682059465632,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/2ee504145e4645709bafb1d7da9ca15c.txt\\",\\"uid\\":1682059468838,\\"status\\":\\"success\\"}]","systemUrl":"[{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/9b5a992496c0472285541cd23f639152.txt\\",\\"uid\\":1682059445654,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/242b462c5855412a91844343e114b3b9.txt\\",\\"uid\\":1682063110435,\\"status\\":\\"success\\"}]","training":"12121213芙芙富","trainingUrl":"[]"},7:{"complaintHandlingProcess":"12131313和发动机凯撒发 ","complaintHandlingProcessUrl":"[]","operationDisposalProcess":"12131返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发","operationDisposalProcessUrl":"[{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_代理委托证明.txt\\",\\"url\\":\\"asfile.donganzichan.cn/476484ff70b341a4b8a83ab936b8e42e.txt\\",\\"uid\\":1682058928018,\\"status\\":\\"success\\"},{\\"name\\":\\"BE-BQ-0008438_仲裁申请书.txt\\",\\"url\\":\\"asfile.donganzichan.cn/41501e6fbc4d44718025973874a87b95.txt\\",\\"uid\\":1682058931807,\\"status\\":\\"success\\"}]"},8:{"accountName":"21213","accountNumber":"21213","bank":"1213","taxNo":"212132323"},9:{"advantage":"12131发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发发货的国际法还款等级撒返回肯定撒返回肯定撒法式咖啡等哈数据库粉红色的卡法术抵抗发"}}',
  uuid: null,
  tagName: null,
  remark: null,
  entrustStaffId: null,
  entrustStaffName: null,
  orgCategoryId: null,
  orgModelId: null,
  orgModelName: null,
  orgCategoryName: null,
  type: '9,8,7,6,5,3,4,1,2',
  isWhiteIp: null,
  whiteIp: null,
  mail: null,
  phone: null,
  sensitiveOrgHitList: [
    {
      hitItem: 'aaaaa',
      hitType: 2
    },
    {
      hitItem: '18800000079',
      hitType: 5
    },
    {
      hitItem: 'bbbbb',
      hitType: 3
    },
    {
      hitItem: '18230000000094774',
      hitType: 4
    }
  ]
}
const handleClose = () => {
  drawer.value = false
}
const open = (id: any) => {
  logId.value = id
  drawer.value = true
  nextTick(() => {
    registerDetail()
    fetchOrgBlacklistHit(id)
  })
}

const registerDetail = async () => {
  // detailData.value = {}

  // const { code, data } = await Apis.registerAuditAllDetail({
  //   logId: logId.value
  // })
  // if (code !== 200) return
  // detailData.value = data
  detailData.value = temddd
  console.log(33, accessDataRef.value)
  accessDataRef.value.handleData(detailData.value, hitList.value)
}
const fetchOrgBlacklistHit = (id: number) => {
  // const { code, data } = Apis.findRegisterOrgBlacklistHit({ registerId: id })
  // if (code !== 200) return
  // hitList.value = data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.color-999 {
  color: #999;
}
</style>
<style lang="scss">
.compliance-detail-drawer {
  position: relative;
  .el-drawer__header {
    margin-bottom: 0;
  }
  .el-drawer__body {
    padding-top: 0;
  }
  .approval-type {
    position: absolute;
    width: 99px;
    height: 80px;
    left: 80px;
    top: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
