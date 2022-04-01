<template>
	<view>
		<view class="print-modal-mask" :animation="animationData" v-if="layerModel">
			<view class="print-modal-mask-dialog" :animation="animationPop">
				<view class="print-modal-mask-dialog-title">{{ title }}</view>
				<view class="print-modal-mask-dialog-content">{{ content }}</view>
				<view class="print-modal-mask-dialog-footer">
					<view class="btn-cancel" @click="changeModalCancel">取消</view>
					<button @click="openSetting" class="btn-confirm">设置</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/*
	 *	Author: DaiZuHua
	 * 	time: 2021-5-12
	 * 	des: 手动提示用户前往开启定位
	 * 		open-type="openSetting" 引导客户跳转设置页面
	 * 		引入该组件方式：<animation-auth-modal ref="layerModel"></animation-auth-modal>
	 * 		通过ref的值调用方法：
	 * 			this.$refs.layerModel.openModal() --- 开启
	 * 			this.$refs.layerModel.hideModal() --- 隐藏
	 * 
	 * 		openSetting方法：让用户授权地址位置
	 * 
	 * 	可通过外界引入组件传入：
	 * 		title： 提示语
	 * 		content： 显示内容
	 */
	export default {
		name: "animation-auth-modal",
		props: {
			// 标题
			title: {
				type: String,
				default: '温馨提示'
			},
			// 简介内容
			content: {
				type: String,
				default: '获取定位失败，请前往设置打开定位权限'
			}
		},
		data() {
			return {
				layerModel: false,
				animationData: '',
				animationPop: '',
				animation: ''
			};
		},
		methods: {
			// 显示
			openModal() {
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: "ease-in",
				})
				this.animation = animation
				animation.opacity(0).step()
				this.animationData = animation.export()
				this.layerModel = true
				setTimeout(() => {
					animation.opacity(1).step()
					this.animationData = animation.export()
				}, 200)
			},
			// 隐藏
			hideModal() {
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: "ease-out",
				})
				this.animation = animation
				animation.opacity(0).step()
				this.animationData = animation.export()
				setTimeout(() => {
					this.layerModel = false
				}, 200)
			},
			// 取消
			changeModalCancel() {
				this.hideModal()
				this.$toast('拒绝授权')
			},
			// 打开授权定位
			openSetting() {
				this.hideModal()
				wx.getSetting({
					success: (res) => {
						// 拒绝授权后再次进入重新授权
						if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
							uni.showModal({
								title: '提示',
								content: '需要获取你的地理位置，请确认授权',
								confirmColor: '#FDD605',
								success:(res)=> {
									if (res.cancel) {
										this.$toast('拒绝授权') 
									} else if (res.confirm) {
										wx.openSetting({
											success: (dbs) => {
												if (dbs.authSetting["scope.userLocation"] == true) {
													//再次授权，调用wx.getLocation的API
													this.getLocation(dbs)
												} else {
													this.$toast('授权失败') 
												}
											}
										})
									}
								},
							})
						} // 初始化进入，未授权
						else if (res.authSetting['scope.userLocation'] == undefined) {
							console.log('authSetting:status:初始化进入，未授权', res.authSetting['scope.userLocation'])
							this.getLocation(res)
						}
						// 已授权
						else if (res.authSetting['scope.userLocation']) {
							console.log('authSetting:status:已授权', res.authSetting['scope.userLocation'])
							this.getLocation(res)
						}
					},
				})

			},
			// 微信获得经纬度
			getLocation(userLocation) {
				// #ifdef MP-WEIXIN
				wx.getLocation({
					type: "wgs84",
					success:(res)=>{
						// wx.openLocation({ //​使用微信内置地图查看位置。
						// 	latitude: res.latitude, //要去的纬度-地址
						// 	longitude: res.longitude, //要去的经度-地址
						// 	name: `地理位置信息`,
						// })
					},
					fail:(res)=>{
						if (res.errMsg === 'getLocation:fail:auth denied') {
							this.$toast('拒绝授权')
						}
						if (!userLocation || !userLocation.authSetting['scope.userLocation']) {
							// that.getUserLocation()  //防止初次进来第一授权会弹出两个框，所以注释不用。
						} else if (userLocation.authSetting['scope.userLocation']) {
							uni.showModal({
								title: '',
								content: '请在系统设置中打开定位服务',
								showCancel: false,
								success: result => {}
							})
						} else {
							this.$toast('授权失败')
						}
					}
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.print-modal-mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		overflow: hidden;
		z-index: 999999;

		&-dialog {
			width: 100%;
			overflow: hidden;
			z-index: 999999;
			background: #f9f9f9;
			border-radius: 20rpx 20rpx 0 0;
			position: absolute;
			bottom: 0;
			height: 400rpx;

			&-title {
				padding-top: 30rpx;
				font-size: 35rpx;
				color: #030303;
				text-align: left;
				padding-left: 30rpx;
			}

			&-content {
				padding: 60rpx 30rpx;
				font-size: 28rpx;
				font-weight: 600;
			}

			&-footer {
				display: flex;
				height: 86rpx;
				font-size: 30rpx;
				line-height: 86rpx;
				position: absolute;
				bottom: 40rpx;
				left: 30rpx;
				right: 0;

				.btn-cancel {
					background-color: $ztd-color-back;
					color: $ztd-color-primary;
					margin-right: 40rpx;
				}

				.btn-confirm {
					background-color: $ztd-color-primary;
					color: $ztd-color-back;
					margin: 0 !important;

					// 尾类
					&::after {
						border: none !important;
					}
				}

				.btn-cancel,
				.btn-confirm {
					flex: 0 0 30%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 30rpx;
					border-radius: 8rpx !important;
				}
			}
		}
	}
</style>
