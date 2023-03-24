# SAAS后台系统管理-租户端
### 技术栈
* vue3 + Router4 + ElementPlus + Pinia
```text
npm install

# npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
npm install --registry=https://registry.npm.taobao.org
```
**Run：**

```text
npm run dev
```

### 图标
图标主要使用elementPlus的icon，还可以自定义svg图标。自定义svg图标需要将图标文件放置在 **src/assets/icons** 中同时执行 `npm run svgo`\
用法：``` <svg-icon name="xxx"></svg-icon> ```大小和颜色继承父元素\
注意事项：自定义svg图标必须小写开头，这主要顾及到页面菜单渲染图标是拿名称是否首字母大小写来判断的，首字母大写为elementPlus，小写为自定义svg图标。新增的图标需要执行`npm run svgo`命令来压缩图标，并需要检查图标代码里面是否有fill属性，有则需求手动清楚不然无法继承父元素的属性

### 项目规范
* element-plus组件统一用小写横杆分隔如：`<el-button>`，自己开发的组件或者公用组件统一用大驼峰如：`<Pagination>`

### 页面规范
* 筛选表单统一用`<FormWrap></FormWrap>`组件包裹。
* 操作按钮统一用`<OperationBar></<OperationBar>`组件包裹，必须添加按钮图标，批量操作类型的按钮需添加`plain`属性
* 表格操作按钮统一添加`link`属性，无需添加图标,操作按钮根据不同操作类型定义`type="primary | success | info | waring | danger"`
* 如图: ![这是图片](https://asfile.donganzichan.cn/assets/image/20230323/f6752296442f4c9798bdef90ca979941.png "页面demo")
