<template>
	<view class="mycourier">
		<view class="mainView">
			<view class="bg-20" v-if="!hasCourier">
				<view class="bg-color">
					<view class="search-box">
						<view class="flex1">
							<InputSearch :isLeft="true" :isRight="false" :itype="'text'" :placeholder="'请输入工号或手机号码'"
								:boxStyle="boxStyle" v-model="searchEmp" @input="inputVal" @touchLeft="search">
							</InputSearch>
						</view>
						<ButtonBox :title="'搜索'" :height="'46rpx'" :radius="'25rpx'" :width="'110rpx'"
							:fontSize="'26rpx'" @hanldChange="search"></ButtonBox>
					</view>
					<view class="courier" v-if="courierInfo">
						<view class="courier-info paddleft" v>
							<view class="name">员工名称: {{empInfo.employeeName||''}}</view>
							<view class="name">员工编码: {{empInfo.employeeCode||''}}</view>
							<view class="name">网点名称: {{empInfo.ownerSite||''}}</view>
							<view class="name">网点编号: {{empInfo.ownerSiteCode||''}}</view>
						</view>
					</view>
					<view class="button" v-if="courierInfo">
						<ButtonBox :title="'确认'" :radius="'35rpx'" height="70rpx" width="500rpx" @hanldChange="bindEmp">
						</ButtonBox>
					</view>
				</view>
			</view>
			<view class="bg-20" v-else>
				<view class="courier">
					<view class="ownerSite">
						<image class="hearImg" src="../../static/img/headImg.png"></image>
						<view class="name">网点名称: {{empInfo.ownerSite||''}}</view>
					</view>
					<view class="button-list">
						<ButtonBox :title="'寄件'" :radius="'35rpx'" height="70rpx" width="260rpx"
							@hanldChange="itembind"></ButtonBox>
						<ButtonBox :title="'解除'" :radius="'35rpx'" height="70rpx" width="260rpx"
							@hanldChange="cancelEmp"></ButtonBox>
					</view>
					<view class="info-wraper">
						<view class="courier-info">
							<view class="name">员工名称: {{empInfo.employeeName||''}}</view>
							<view class="address">员工编码: {{empInfo.employeeCode}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="scanView">
			<!-- <view class="tips" v-if='hasTips'>
	      您还没有绑定快递小哥哦~
	      <image src="../../static/img/closeTips.png"  @click="closeTips" ></image>
	    </view> -->
			<view class="bg-20">
				<view class="scanPage" @click="scanCourier">
					<image class="scanIcon" src="../../static/img/scanIcon.png"></image>
					<view class="scanText">
						<view>扫码绑定</view>
						<view>扫描快递小哥二维码</view>
						<view>即可享受快递寄件、专属送快递服务</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// let sallists = [
	// 	{name:"张唯一",num:"1993",star:"五",icon:"/static/icon/xiaoge.png"},
	// 	{name:"张唯二",num:"1993",star:"五",icon:"/static/icon/xiaoge.png"},
	// 	{name:"张唯三",num:"1993",star:"五",icon:"/static/icon/xiaoge.png"},
	// 	{name:"张唯",num:"1993",star:"五",icon:"/static/icon/xiaoge.png"}
	// ];
	export default {
		data() {
			return {
				hasCourier: false,
				empCode: '',
				searchEmp: '',
				empInfo: {},
				hasTips: true,
				pageId: '',
				courierInfo: false
			}
		},
		onLoad() {
			let self = this;
			self.getUseInfo()
		},
		methods: {
			scanCourier() {
				let self = this;
				uni.scanCode({
					success: function(res) {
						console.log(res)
						let empCode = res.result;
						let _data = {
							empCode: empCode
						}
						self.$api.scanbindEmp(_data).then(res => {
							console.log(res)
							if (res.code == 200) {
								self.empInfo = {
									ownerSite: res.data.ownerSite,
									employeeName: res.data.employeeName,
									employeeCode: res.data.employeeCode,
									ownerSiteCode: res.data.ownerSiteCode,
								};
								self.empCode = res.data.employeeCode;
								self.hasCourier = true;
							} else {
								uni.showToast({
									icon: "none",
									title: '该员工不存在或者未启用！'
								});
							}
						})

					}
				});
			},
			inputVal(val) {
				let self = this;
				self.searchEmp = val
			},
			//工号搜索
			search() {
				let self = this;
				if (self.searchEmp == '') {
					uni.showToast({
						icon: "none",
						title: "请输入工号或手机号码",
						duration: 1500
					});
					return;
				};
				let _data = {
					mobilePhone: self.searchEmp.toUpperCase(),
				}
				self.$api.getEmpBylike(_data).then(res => {
					console.log(res)
					if (res.code == 200 && res.data.length > 0) {
						self.empInfo = {
							ownerSite: res.data[0].ownerSite,
							employeeName: res.data[0].employeeName,
							employeeCode: res.data[0].employeeCode,
							ownerSiteCode: res.data[0].ownerSiteCode,
						};
						self.courierInfo = true;
						self.empCode = res.data[0].employeeCode;
					} else {
						uni.showToast({
							icon: "none",
							title: '员工查询失败~',
							duration: 1500
						});
					}
				})
			},
			getUseInfo() {
				let self = this;
				self.$api.getUser().then(res => {
					if (res.code == 200) {
						if (res.data.employeeName) {
							self.empInfo.employeeCode = res.data.employeeCode
							self.empInfo.employeeName = res.data.employeeName
							self.empInfo.ownerSite = res.data.siteName
							self.empInfo.ownerSiteCode = res.data.siteCode
							self.hasCourier = true
						}
					}
				})
			},
			// 员工绑定
			bindEmp() {
				let self = this;
				if (JSON.stringify(self.empInfo) == '{}') {
					uni.showToast({
						icon: "none",
						title: "请输入先查询员工信息",
						duration: 1500
					});
					return;
				};
				let _data = {
					token: self.$getStorageSync('token'),
					siteName: self.empInfo.ownerSite,
					employeeName: self.empInfo.employeeName,
					employeeCode: self.empInfo.employeeCode,
					siteCode: self.empInfo.ownerSiteCode,
				}
				self.$api.binDingEmp(_data).then(res => {
					console.log(res)
					if (res.code == 200) {
						self.hasCourier = true;
					} else {
						uni.showToast({
							icon: "none",
							title: '该员工不存在或者未启用！',
							duration: 1500
						});
						self.empInfo = {}
					}
				})
			},
			cancelEmp() {
				let self = this;
				self.$api.unbindEmp().then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: "none",
							title: '解除绑定成功~'
						});
						self.empInfo = {}
						self.empCode = ''
						self.searchEmp = ''
					}
					self.hasCourier = false;
				})
			},
			itembind() {
				let self = this;
				let _data = {
					specEmployeeName: this.empInfo.employeeName,
					specEmployeeCode: this.empInfo.employeeCode,
					ownerSite: this.empInfo.ownerSite,
					ownerSiteCode: this.empInfo.ownerSiteCode
				}
				uni.redirectTo({
					url: "/pages/order/send/index?pageId=zskdy&data=" + JSON.stringify(_data)
				})
			},
			getEmployeeList() {
				let self = this;
				self.$api.getEmployeeList().then(res => {
					if (res.code == 200) {
						console.log(res.data)
						this.sallist = res.data
					} else {

					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mycourier {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		background-color: $ztd-color-bgcolor;
		.bg-20 {
			width: 100%;
			height: auto;
			padding: 0 20rpx;

		}

		.search-box {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.flex1 {
				flex: 1;
				margin-right: 20rpx;
			}
		}

		.bg-color {
			background-color: #fff;
			padding: 20rpx;
		}

		.paddleft {
			padding-left: 80rpx;
		}

		.button {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 20rpx;
		}

		.name {
			margin-bottom: 16rpx;
			color: #222;
		}

		.mainView {
			width: 100%;
			height: auto;
			margin: 20rpx 0;

			.courier {
				padding: 26rpx 20rpx;
				border-radius: 10rpx;

				.info-wraper {
					position: relative;
					width: 100%;
					height: auto;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						position: absolute;
						right: 16rpx;
						top: 18px;
						width: 50rpx;
						height: 50rpx;
					}

					.courier-info {

						.address {
							color: #222;
						}

						.clickItem {
							border: 2rpx solid $ztd-color-primary;
							border-radius: 8rpx;
							color: $ztd-color-primary;
							padding: 2rpx 8rpx;
						}
					}
				}
			}
		}

		.scanView {
			height: auto;
			width: 100%;
			position: relative;

			.tips {
				position: relative;
				background-color: #FFF0E1;
				color: #FFB138;
				font-size: 28rpx;
				height: 80rpx;
				line-height: 80rpx;
				padding-left: 20rpx;

				image {
					position: absolute;
					right: 20rpx;
					top: 16rpx;
					width: 50rpx;
					height: 50rpx;
				}
			}

			.scanPage {
				background-color: #fff;
				margin-top: 20rpx;
				padding: 30rpx 0;
				border-radius: 8rpx;

				.scanText {
					color: #999;
					font-size: 26rpx;

					view:first-child {
						font-size: 28rpx;
						color: #222;
						font-weight: bold;
						margin-bottom: 16rpx;
					}
				}
			}
		}

		.mainView,
		.scanView {
			.scanPage {
				width: 100%;
				height: auto;
				display: flex;
				justify-content: flex-start;
				background-color: #fff;
				align-items: center;

				.scanIcon {
					width: 80rpx;
					height: 80rpx;
					margin: 30rpx;
				}

			}

			.courier {
				background-color: #fff;
				width: 100%;
				height: auto;

				.ownerSite {
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					align-items: center;
					flex-direction: column;

					.hearImg {
						width: 60rpx;
						height: 60rpx;
					}
				}

				.button-list {
					display: flex;
					justify-content: space-around;
					align-items: center;
					padding: 20rpx 0;
				}
			}

		}

	}
</style>
