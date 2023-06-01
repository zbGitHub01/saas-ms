<template>
  <div class="statement">
    <h4>注意事项</h4>
    <div class="item">
      1.导入案件必须使用系统提供的标准案件导入模板，已设置必填的字段进行导入。导入文件表头名称需与字段名称相同。
    </div>
    <div class="item">2.模板表头不可编辑，必填项不能为空，否则无法成功导入数据。</div>
    <div class="item">3.导入前请检查excel表格内数值格式正确，如果格式不正确将无法成功导入数据。</div>
    <div class="item">4.数据行如缺少必填项数据，该条案件将视为无效行不读取，自动跳过。</div>
    <div class="item">5.以案件号为唯一识别标识，重复导入将覆盖已读取成功的数据但空数据不覆盖已存在数据，原来为空的则追加。</div>
  </div>
</template>

<script setup>
// watch: {
//   $route: {
//     handler: function(route) {
//       this.redirect = route.query && route.query.redirect
//     },
//     immediate: true
//   }
// }
</script>

<style lang="scss" scoped>
.statement {
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-fill-color-blank);
  border-radius: 4px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
h4 {
  margin: 0 0 20px 0;
}
.item {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #bbb;
}
</style>
