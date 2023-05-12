<template>
  <el-tabs class="tabs" :model-value="props.modelValue" @tabClick="tabClick">
    <el-tab-pane label="在职信息" name="1">
      <el-descriptions class="descriptions" :column="4">
        <el-descriptions-item label="所属部门" :span="4">浙江温泽企业管理有限公司</el-descriptions-item>
        <el-descriptions-item label="工号" width="25%">001</el-descriptions-item>
        <el-descriptions-item label="在职状态">在职</el-descriptions-item>
        <el-descriptions-item label="星级">4星</el-descriptions-item>
        <el-descriptions-item label="是否接案">是</el-descriptions-item>
        <el-descriptions-item label="入职日期">2019-01-21</el-descriptions-item>
        <el-descriptions-item label="离职日期" :span="3"></el-descriptions-item>
        <el-descriptions-item label="合同起始日期">2019-01-21</el-descriptions-item>
        <el-descriptions-item label="合同结束日期">2023-01-21</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="个人资料" name="2">
      <el-descriptions class="descriptions" :column="4">
        <el-descriptions-item label="户籍地址" :span="2" width="50%">贵阳省思南县兴隆乡合心村旧家坪组</el-descriptions-item>
        <el-descriptions-item label="现居地址" :span="2">贵阳市云岩区中坝路</el-descriptions-item>
        <el-descriptions-item label="出生日期" width="25%">1999-10-20</el-descriptions-item>
        <el-descriptions-item label="婚姻状况">已婚</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">张兮兮</el-descriptions-item>
        <el-descriptions-item label="联系人电话">--</el-descriptions-item>
        <el-descriptions-item label="工资卡卡号" :span="2">6214830313989526</el-descriptions-item>
        <el-descriptions-item label="工资卡开户行" :span="2">招商银行贵阳分行金阳支行</el-descriptions-item>
        <el-descriptions-item label="毕业院校" :span="2">黔东南民族职业技术学院</el-descriptions-item>
        <el-descriptions-item label="学历">大专</el-descriptions-item>
        <el-descriptions-item label="专业">医药</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="面试考评" name="3">
      <el-descriptions class="descriptions" :column="4">
        <el-descriptions-item label="人力来源">内推</el-descriptions-item>
        <el-descriptions-item label="推荐人" :span="3">张兮兮</el-descriptions-item>
        <el-descriptions-item label="面试批次" width="25%">2020-4-7</el-descriptions-item>
        <el-descriptions-item label="面试官">张兮兮</el-descriptions-item>
        <el-descriptions-item label="面试结果" :span="2">通过</el-descriptions-item>
        <el-descriptions-item label="表达能力" width="25%">15</el-descriptions-item>
        <el-descriptions-item label="逻辑思维" width="25%">15</el-descriptions-item>
        <el-descriptions-item label="责任心、进取心" width="25%" label-class-name="w100">21</el-descriptions-item>
        <el-descriptions-item label="创新及应变" width="25%">22</el-descriptions-item>
        <el-descriptions-item label="胜任力情况">有能力、有意愿</el-descriptions-item>
        <el-descriptions-item label="综合考评">优秀</el-descriptions-item>
        <el-descriptions-item label="综合得分" :span="2">73</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="新人培训" name="4">
      <el-descriptions class="descriptions" :column="4">
        <el-descriptions-item label="是否参加培训" width="25%">是</el-descriptions-item>
        <el-descriptions-item label="培训师">张子熙熙</el-descriptions-item>
        <el-descriptions-item label="进组时间" :span="2">2023-05-09</el-descriptions-item>
        <el-descriptions-item label="是否合格">合格</el-descriptions-item>
        <el-descriptions-item label="是否补考">否</el-descriptions-item>
        <el-descriptions-item label="最终成绩" :span="2">93</el-descriptions-item>
        <el-descriptions-item label="话术成绩">92</el-descriptions-item>
        <el-descriptions-item label="系统成绩">92</el-descriptions-item>
        <el-descriptions-item label="综合成绩">95</el-descriptions-item>
        <el-descriptions-item label="态度成绩">92</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="档案记录" name="5">
      <el-descriptions class="descriptions-block" :column="2">
        <el-descriptions-item label="身份证正面" width="50%">
          <el-image
            class="card-img"
            src="//asfile.donganzichan.cn/assets/image/20220623/b2a2ae4a3223435aa0cf67304658e188.gif"
          ></el-image>
        </el-descriptions-item>
        <el-descriptions-item label="身份证反面">
          <el-image
            class="card-img"
            src="//asfile.donganzichan.cn/assets/image/20220623/b2a2ae4a3223435aa0cf67304658e188.gif"
          ></el-image>
        </el-descriptions-item>
        <el-descriptions-item label="应聘面试登记表">--</el-descriptions-item>
        <el-descriptions-item label="应聘人员问卷调查表">--</el-descriptions-item>
        <el-descriptions-item label="面试评估表"></el-descriptions-item>
        <el-descriptions-item label="入职登记表"></el-descriptions-item>
        <el-descriptions-item label="工资卡确认单"></el-descriptions-item>
        <el-descriptions-item label="薪资确认单"></el-descriptions-item>
        <el-descriptions-item label="承诺书"></el-descriptions-item>
        <el-descriptions-item label="劳动合同"></el-descriptions-item>
        <el-descriptions-item label="保密协议"></el-descriptions-item>
        <el-descriptions-item label="签收单"></el-descriptions-item>
        <el-descriptions-item label="员工行为守则"></el-descriptions-item>
        <el-descriptions-item label="质量管理责任制度"></el-descriptions-item>
        <el-descriptions-item label="近一年的社保缴纳记录/工资流水"></el-descriptions-item>
        <el-descriptions-item label="征信报告"></el-descriptions-item>
        <el-descriptions-item label="离职证明"></el-descriptions-item>
        <el-descriptions-item label="体检报告"></el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const tabClick = val => {
  emit('update:modelValue', val.paneName)
}
</script>

<style lang="scss" scoped>
.tabs {
  :deep(.el-tabs__active-bar) {
    transition: none;
  }
}
.descriptions {
  :deep(.el-descriptions__label) {
    display: inline-block;
    width: 85px;
    text-align: right;
  }
  :deep(.w100) {
    width: 100px;
    margin-left: -15px;
  }
}
.descriptions-block {
  :deep(.el-descriptions__content) {
    display: block;
    margin-top: 10px;
  }
}
.card-img {
  width: 230px;
  height: 120px;
}
</style>
