<template>
  <div>
    <el-radio-group v-model="radio">
      <template v-for="(item, index) in colorList" :key="index">
        <el-radio :label="item.type"><span style="width: 60px; height: 20px" :style="item.style">哈哈哈</span></el-radio>
      </template>
      <el-radio :label="100" style="margin-top: 10px">还原</el-radio>
    </el-radio-group>
  </div>
</template>
  <script>
export default {
  data() {
    return {
      radio: 100,
      colorList: [
        {
          type: 96,
          style: {
            background: '#ED4014',
            color: '#ED4014'
          }
        },
        {
          type: 97,
          style: {
            background: '#FF9900',
            color: '#FF9900'
          }
        },
        {
          type: 98,
          style: {
            background: '#2DB7F5',
            color: '#2DB7F5'
          }
        },
        {
          type: 99,
          style: {
            background: '#19BE6B',
            color: '#19BE6B'
          }
        },
        {
          type: 292,
          style: {
            background: '#afcd50',
            color: '#afcd50'
          }
        },
        {
          type: '293',
          style: {
            background: '#dbdbdb',
            color: '#dbdbdb'
          }
        },
        {
          type: 294,
          style: {
            background: '#955ceb',
            color: '#955ceb'
          }
        }
      ]
    }
  }
}
</script>