<template>
	<view>
		<view class="load-modal load" :class="showShadow?'load-shadow':''" v-if="loadShow">
			<image :src="imgUrl" mode="aspectFill" v-if="isImg"></image>
			<view>{{text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			loadShow: {
				type: Boolean,
				default: false,
				required: true
			},
			imgUrl: {
				type: String,
				default: '/static/img/loading.gif'
			},
			text: {
				type: String,
				default: '加载中...'
			},
			overtime: {
				type: Number,
				default: 12000
			},
			isImg: {
				type: Boolean,
				default: true
			},
			showShadow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				timeoutID: ''
			};
		},
		watch: {
			loadShow: function(newVal, oldVal) {
				const that = this
				if (newVal === true) {
					that.timeoutID = setTimeout(function() {
						this.$emit('update:loadShow', false)
						uni.showToast({
							title: '请求超时,请稍后再试!',
							icon: 'none'
						})
					}, that.overtime)
				} else {
					clearTimeout(that.timeoutID)
				}
			}
		},
	}
</script>

<style lang="scss">
	.load.load-modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 140rpx;
		left: 0;
		margin: auto;
		width: 240rpx;
		height: 240rpx; 
		background-color: #4C4C4C;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		font-size: 28rpx;
		z-index: 9999;
		line-height: 2.4em;
		overflow: hidden;

		image {
			width: 60rpx;
			height: 60rpx;
			margin-bottom: 30rpx;
		}

		view {
			font-size: 20rpx;
			line-height: 20rpx;
			font-size: 26rpx;
			color: $ztd-color-white;
		}
	}

	.load-shadow {
		/* 蒙版 */
		box-shadow: 0 0 0rpx 2000rpx rgba(0, 0, 0, 0.5);
	}
</style>
