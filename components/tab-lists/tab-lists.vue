<template>
	<!-- 信息导航 -->
	<view class="infotab">
		<view class="infotab-box">
			<slot></slot>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
.infotab{
	width: 100%;
	z-index: 999;
	padding: 20rpx 40rpx 4rpx;
	&-box{
		width: 100%;
		background: $ztd-color-white;
		display: flex;
		border-radius: $ztd-border-radius;
		padding: 20rpx;
		// height: 160rpx;
		box-shadow: $ztd-shadow;
	}
}
</style>
