# toast提示框
<fh-toast\>是一个提示框。目前提供三种模式：1、纯文字提示模式；2、加载中提示模式；3、文字加图标提示模式
# 平台差异
实现中使用到<canvas\>标签，除字节跳动小程序外基本支持
# 安装方式
本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，通过**使用HBuilderX导入插件**或者**下载插件ZIP**，将解压出**fh-toast**文件夹放到**components**目录下。
# API
## Props
目前无需传入
## Event
目前没有事件
## Methods
| 方法名 | 入参 | 返回值 | 说明 |
|-------|------|--------|-----|
| show | { title, isHTMLString, isLoading, icon } | - | 打开提示框，title：弹框内容；isHTMLString：是否传入html；isLoading：是否展示加载中图标；icon：是否展示图标 |
| hidden | - | - | 关闭提示框 |
## Slot
| slot名 | 属性 | 说明 |
|--------|-----|------|
| toastIcon | - | 图标插槽，需要在show方法传入的对象属性中将icon设为true才会展示 |
# 基本用法
~~~
<template>
    <fh-toast
    	ref="fhToast"
    >
		<template v-slot:toastIcon>
			<icon type="success_no_circle" size="26"/>
		</template>
	</fh-toast>
</template>
<script>
export default {
	methods: {
		openToast: function({title, isHTMLString, isLoading, icon}) {
			this.$refs.fhToast.show({title, isHTMLString, isLoading, icon})
		},
		closeToast: function(){
			this.$refs.fhToast.hidden()
		}
	}
}
</script>
~~~