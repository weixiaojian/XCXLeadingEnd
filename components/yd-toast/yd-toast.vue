<template>
	<view v-if="showAble">
		<view class="fh-toast" :class="isLoading || !!icon ? 'fh-toast-size' : 'fh-toast-context'">
			<view v-if="isLoading || !!icon" class="fh-toast-icon">
				<view v-if="isLoading" class="loading-circular">
					<span class="loading-circular-span"><loading-circle></loading-circle></span>
				</view>
				<view v-if="!!icon"><slot name="toastIcon"></slot></view>
			</view>
			<view v-if="!isHTMLString">
				<view class="fh-title" :class="isLoading || !!icon ? 'fh-icon-title' : ''">
					{{ title }}
				</view>
			</view>
			<view
				v-else
				v-html="title"
				class="fh-title"
				:class="isLoading || !!icon ? 'fh-icon-title' : ''"
			></view>
		</view>
		<view v-if="showAble" class="fh-toast-mask"></view>
	</view>
</template>

<script>
/**
 * FhToast toast提示框
 * @description APP端toast提示框，有loading、带图标模式
 */
import LoadingCircle from './loading-circle.vue'
export default {
	name: 'FhToast',
	components: {
		LoadingCircle
	},
	data() {
		return {
			showAble: false,
			title: null,
			isHTMLString: false,
			isLoading: false
		}
	},
	methods: {
		/**
		 * title：弹框内容；isHTMLString：是否传入html；isLoading：是否展示加载中图标；icon：自定义图标
		 */
		show({ title, isHTMLString, isLoading, icon }) {
			this.showAble = true
			this.title = title
			this.isHTMLString = !!isHTMLString
			this.isLoading = !!isLoading
			this.icon = icon
			if (!!isLoading) {
				return
			}
			const time = setTimeout(() => {
				this.showAble = false
				clearTimeout(time)
			}, 2500)
		},
		hidden() {
			this.showAble = false
		}
	}
}
</script>

<style scoped lang="scss">
.fh-toast {
	position: absolute;
	z-index: 20001;
	top: 50%;
	left: 50%;
	// width:auto;
	max-width: 450rpx;
	transform: translate(-50%, -50%);
	background-repeat: no-repeat;
	background-size: 175.79rpx;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	flex-direction: column !important;
	border-radius:10rpx;
	padding:20rpx;
	min-height: 58.6rpx;
	.fh-toast-icon {
		margin: 40.29rpx 0 24.91rpx 0;
		text-align: center;
	}

	.fh-title {
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		width: 100%;
		line-height:46rpx;
		// font-family: PingFangSC-Medium;
		font-size: 26rpx;
		font-weight: 500;	
		color: #fbfbfb;
		text-align: center;
		word-wrap: break-word;
		flex-direction: column;
	}

	.fh-icon-title {
		line-height: 18.32rpx;
		font-size: 13.19rpx;
		font-weight: 550;
	}
}

.fh-toast-mask {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 20000;
}

.fh-toast-size {
	width: 146.49rpx;
	height: 146.49rpx;
	background-size: 146.49rpx;
	padding: 0 18.32rpx;
	border-radius: 14.65rpx;
}

.fh-toast-context {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.loading-circular {
	font-size: 0;
	vertical-align: middle;
	color: #fff;
	text-align: center;
	.loading-circular-span {
		display: inline-block;
		width: 32.23rpx;
		max-width: 100%;
		height: 32.23rpx;
		max-height: 100%;
		vertical-align: middle;
		-webkit-animation: rotate 2s linear infinite;
		animation: rotate 2s linear infinite;
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@-webkit-keyframes rotate {
	0% {
		-webkit-transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
	}
}
</style>
