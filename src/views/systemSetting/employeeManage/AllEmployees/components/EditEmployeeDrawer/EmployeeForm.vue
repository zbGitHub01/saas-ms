<template>
  <el-form class="form" :model="form" label-width="110" inline>
    <el-tabs class="tabs" :model-value="props.modelValue" @tabClick="tabClick">
      <el-tab-pane label="在职信息" name="1">
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
            clearable
            placeholder="请选择所属部门"
          />
        </el-form-item>
        <div>
          <el-form-item label="工号">
            <el-input v-model="form.name" placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="在职状态">
            <el-select v-model="form.name" placeholder="请选择在职状态">
              <el-option label="在职" value="1"></el-option>
              <el-option label="离职" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星级">
            <el-select v-model="form.name" placeholder="请选择星级">
              <el-option label="1星" value="1"></el-option>
              <el-option label="2星" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否接案">
            <el-select v-model="form.name" placeholder="请选择是否接案">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职日期">
            <el-date-picker v-model="form.name" value-format="YYYY-MM-DD" type="date" placeholder="请选择入职日期" />
          </el-form-item>
          <el-form-item label="离职日期">
            <el-date-picker v-model="form.name" value-format="YYYY-MM-DD" type="date" placeholder="请选择离职日期" />
          </el-form-item>
          <el-form-item label="合同起始日期">
            <el-date-picker v-model="form.name" value-format="YYYY-MM-DD" type="date" placeholder="请选择合同起始日期" />
          </el-form-item>
          <el-form-item label="合同结束日期">
            <el-date-picker v-model="form.name" value-format="YYYY-MM-DD" type="date" placeholder="请选择合同结束日期" />
          </el-form-item>
        </div>
      </el-tab-pane>
      <el-tab-pane label="个人资料" name="2">
        <el-form-item label="户籍地址">
          <el-input v-model="form.name" placeholder="请输入户籍地址" />
        </el-form-item>
        <el-form-item label="现居地址">
          <el-input v-model="form.name" placeholder="请输入现居地址" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.name" value-format="YYYY-MM-DD" type="date" placeholder="请选择出生日期" />
        </el-form-item>
        <el-form-item label="婚姻状况">
          <el-select v-model="form.name" placeholder="请选择婚姻状况">
            <el-option label="未婚" value="1"></el-option>
            <el-option label="已婚" value="2"></el-option>
            <el-option label="离异" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急联系人">
          <el-input v-model="form.name" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="form.name" :maxlength="11" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="工资卡卡号">
          <el-input v-model="form.name" placeholder="请输入工资卡卡号" />
        </el-form-item>
        <el-form-item label="工资卡开户行">
          <el-input v-model="form.name" placeholder="请输入工资卡开户行" />
        </el-form-item>
        <el-form-item label="毕业院校">
          <el-input v-model="form.name" placeholder="请输入毕业院校" />
        </el-form-item>
        <el-form-item label="学历">
          <el-input v-model="form.name" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.name" placeholder="请输入专业" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="面试考评" name="3">
        <el-form-item label="人力来源">
          <el-input v-model="form.name" placeholder="请输入人力来源" />
        </el-form-item>
        <el-form-item label="紧急推荐人">
          <el-input v-model="form.name" placeholder="请输入紧急推荐人" />
        </el-form-item>
        <el-form-item label="面试批次">
          <el-input v-model="form.name" placeholder="请输入面试批次" />
        </el-form-item>
        <el-form-item label="面试官">
          <el-input v-model="form.name" placeholder="请输入面试官" />
        </el-form-item>
        <el-form-item label="表达能力">
          <el-input v-model="form.name" placeholder="请输入表达能力" />
        </el-form-item>
        <el-form-item label="逻辑思维">
          <el-input v-model="form.name" placeholder="请输入逻辑思维" />
        </el-form-item>
        <el-form-item label="责任心、进取心">
          <el-input v-model="form.name" placeholder="请输入责任心、进取心" />
        </el-form-item>
        <el-form-item label="创新及应变">
          <el-input v-model="form.name" placeholder="请输入创新及应变" />
        </el-form-item>
        <el-form-item label="胜任力情况">
          <el-input v-model="form.name" placeholder="请输入胜任力情况" />
        </el-form-item>
        <el-form-item label="综合考评">
          <el-input v-model="form.name" placeholder="请输入综合考评" />
        </el-form-item>
        <el-form-item label="综合得分">
          <el-input v-model="form.name" placeholder="请输入综合得分" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="面试考评" name="4">
        <el-form-item label="是否参加培训">
          <el-input v-model="form.name" placeholder="请输入是否参加培训" />
        </el-form-item>
        <el-form-item label="培训师">
          <el-input v-model="form.name" placeholder="请输入培训师" />
        </el-form-item>
        <el-form-item label="进组日期">
          <el-date-picker v-model="form.name" value-format="YYYY-MM-DD" type="date" placeholder="请选择进组日期" />
        </el-form-item>
        <el-form-item label="是否合格">
          <el-input v-model="form.name" placeholder="请输入是否合格" />
        </el-form-item>
        <el-form-item label="是否补考">
          <el-input v-model="form.name" placeholder="请输入是否补考" />
        </el-form-item>
        <el-form-item label="最终成绩">
          <el-input v-model="form.name" placeholder="请输入最终成绩" />
        </el-form-item>
        <el-form-item label="话术成绩">
          <el-input v-model="form.name" placeholder="请输入话术成绩" />
        </el-form-item>
        <el-form-item label="系统成绩">
          <el-input v-model="form.name" placeholder="请输入系统成绩" />
        </el-form-item>
        <el-form-item label="综合成绩">
          <el-input v-model="form.name" placeholder="请输入综合成绩" />
        </el-form-item>
        <el-form-item label="态度成绩">
          <el-input v-model="form.name" placeholder="请输入态度成绩" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="档案记录" name="5">
        <el-row>
          <el-col :span="12">
            <el-form-item class="label-block" label="身份证正面">
              <UploadImg v-model:image-file="form.imgUrl" width="230px" height="120px">
                <template #empty>
                  <el-icon><Picture /></el-icon>
                  <span>请上传身份证正面</span>
                </template>
              </UploadImg>
            </el-form-item>
            <el-form-item class="label-block" label="应聘面试登记表">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="面试评估表">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="工资卡确认单">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="承诺书">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="保密协议">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="员工行为守则">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="近一年的社保缴纳记录/工资流水">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="离职证明">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="label-block" label="身份证反面">
              <UploadImg v-model:image-file="form.imgUrl" width="230px" height="120px">
                <template #empty>
                  <el-icon><Picture /></el-icon>
                  <span>请上传身份证反面</span>
                </template>
              </UploadImg>
            </el-form-item>
            <el-form-item class="label-block" label="应聘人员问卷调查表">
              <UploadImgs v-model:image-list="form.imgList">
                <template #empty>
                  <el-icon><Picture /></el-icon>
                  <span>请上传图片</span>
                </template>
              </UploadImgs>
            </el-form-item>
            <el-form-item class="label-block" label="入职登记表">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="薪资确认单">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="劳动合同">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="签收单">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="质量管理责任制度">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="征信报告">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
            <el-form-item class="label-block" label="体检报告">
              <UploadFile v-model:file-list="form.fileList" :limit="0"></UploadFile>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/modules/common'
import { UploadImg, UploadFile, UploadImgs } from '@/components/Upload'

const commonStore = useCommonStore()
const deptTree = computed(() => commonStore.dropdownList.DEPT)

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const tabClick = val => {
  emit('update:modelValue', val.paneName)
}
const form = reactive({
  deptId: null,
  name: null,
  imgUrl: null,
  imgList: [
    {
      name: 'eafb7a682b628ba7ef06717f1e1702c4.png',
      url: '//asfile.donganzichan.cn/7f028779c1a043d3a07057eeb95663c7.png',
      fileId: '735'
    }
  ],
  fileList: [
    {
      fileId: '722',
      name: '9月法诉--法院开展情况.xlsx',
      url: '//asfile.donganzichan.cn/18bf95a41cae40809e0870b51dd71a3e.xlsx'
    }
  ]
})
defineExpose({ form })
</script>

<style lang="scss" scoped>
.form {
  :deep(.el-input) {
    width: 210px;
  }
}
.form-item-block {
  display: flex;
}
.label-block {
  display: block;
  :deep(.el-form-item__label) {
    justify-content: flex-start;
    width: 100% !important;
  }
}
.tabs {
  :deep(.el-tabs__active-bar) {
    transition: none;
  }
}
</style>
