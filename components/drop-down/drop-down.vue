<template>
	<view class="dropDown">
		<text v-if="num==-1">暂无信息</text>
		<text v-if="num==0">加载中...</text>
		<text v-if="num==1">没有更多数据</text>
	</view>
</template>

<script>
	export default {
		props:{
			num:{
				type:[String,Number],
				default:0
			}
		}
	}
</script>

<style lang="scss" scoped>
.dropDown{
	width: 100%;
	display: flex;
	height: 80rpx;
	justify-content: center;
	align-items: center;
	text{
		font-size: 28rpx;
	}
}
</style>
