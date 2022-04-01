<template>
	<view class="bar-sticky">
		<view class="status-line"
			:style="{height: lineHeight, background: navigationBarStyle.background || normal.background}"></view>
		<view class="bar-line" :style="{background: navigationBarStyle.background || normal.background}">
			<view class="bar-line container-in"
				:style="{background: navigationBarStyle.background || normal.background}">
				<view class="bar-content" v-if="!custom" @click="navBar">
					<view class="bar-back">
						<image class="bar-back-img" :src="navigationBarStyle.icon"></image>
						<view class="bar-back-teamText"
							:style="{color: navigationBarStyle.iconColor || normal.iconColor}">
							{{navigationBarStyle.teamText}}
						</view>
						<image class="bar-back-img" src="/static/img/xiangxia.png"></image>
					</view>
					<view class="bar-title" :style="{color: navigationBarStyle.fontColor || normal.fontColor}">
						{{navigationBarStyle.title}}
					</view>
				</view>
				<view class="container-in" v-else>
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			custom: {
				type: Boolean,
				default: false
			}, //自定义头部，否则沿用原生的头部样式
			navigationBarStyle: {
				type: Object,
				default: function() {
					return {
						background: '',
						fontColor: '#000000',
						iconColor: '#000000',
						icon: '', // 显示模式icon
						teamText: '', // 模式切换
						title: '', //导航栏文字
					}
				}
			}, //原生头部自定义样式
		},
		data() {
			return {
				normal: {
					background: '#FFFFFF',
					fontColor: '#000000',
					iconColor: '#000000',
				}, //公用样式,个性化样式可通过传值实现
				lineHeight: '' //状态栏高度
			};
		},
		mounted() {
			const systemInfo = uni.getSystemInfoSync();
			// px转换到rpx的比例
			let pxToRpxScale = 750 / systemInfo.windowWidth;
			let systems = {
				ktxStatusHeight: systemInfo.statusBarHeight * pxToRpxScale, // 状态栏的高度
				navigationHeight: 44 * pxToRpxScale, // 导航栏的高度
				ktxWindowWidth: systemInfo.windowWidth * pxToRpxScale, // window的宽度
				ktxWindowHeight: systemInfo.windowHeight * pxToRpxScale, // window的高度
				ktxScreentHeight: systemInfo.screenHeight * pxToRpxScale, // 屏幕的高度
			}
			// 底部tabBar的高度
			systems.tabBarHeight = systems.ktxScreentHeight - systems.ktxStatusHeight - systems.navigationHeight - systems
				.ktxWindowHeight // 底部tabBar的高度
			this.lineHeight = systems.ktxStatusHeight + 'rpx';
			this.$emit('getHeight', systems)
		},
		methods: {
			// 切换形态
			navBar() {
				this.$emit('navBar');
			}
		}
	}
</script>

<style lang="scss">
	/*正中*/
	.bar-content {
		width: 100%;
		display: flex;
		// flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	//导航栏吸顶效果
	.bar-sticky {
		position: sticky;
		position: -webkit-sticky;
		top: 0;
		z-index: 101;
	}

	/*垂直居中*/
	.container-in {
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		width: 100%;
		height: 44px;
	}

	.bar-line {
		height: 44px; //导航栏高度

		.bar-back {
			position: absolute;
			left: 30rpx;
			display: flex;
			align-items: center;

			&-img {
				width: 40rpx;
				height: 40rpx;
			}

			&-teamText {
				font-size: 32rpx;
				margin-left: 10rpx;
			}
		}

		.bar-title {
			width: 250rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			font-size: 32rpx;
		}
	}
</style>
