<template>
	<!-- 实名认证 -->
	<view class="myrealname">
		<view class="myrealname-item">
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">姓名:</view>
				<input type="text" v-model="realName" placeholder="请输入姓名" maxlength="10" />
				<text class="tips">必填</text>
			</view>
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">手机号码:</view>
				<input type="number" v-model="phone" disabled="true" placeholder="请输入手机号码" maxlength="11" />
				<text class="tips">必填</text>
			</view>
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">证件类型:</view>
				<input type="text" value="身份证" placeholder="" disabled="true" />
			</view>
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">证件号:</view>
				<input type="text" v-model="realIdCode" placeholder="身份证号码" maxlength="18" />
				<text class="tips">必填</text>
			</view>
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">性别:</view>
				<view class="checkbox">
					<radio-group @change="radioChange">
						<label class="radio">
							<radio :value="'1'" :checked="sex=='1'" style="transform:scale(0.7)" color="#FDD605" />男
						</label>
						<label class="radio">
							<radio :value="'0'" :checked="sex=='0'" style="transform:scale(0.7)" color="#FDD605" />女
						</label>
					</radio-group>
				</view>
			</view>
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">民族:</view>
				<view class="flexRow">
					<picker @change="bindPickerChange" value="index" :range="mockList" range-key="name">
						<input type="text" style="width: 100%;" :value="nationality" placeholder="" disabled="true" />
					</picker>
					<i class="iconfont">&#xe645;</i>
				</view>
			</view>
			<view class="myrealname-item-list">
				<view class="myrealname-item-list-name">证件地址:</view>
				<input type="text" v-model="address_detail" placeholder="请输入证件地址" />
			</view>
		</view>
		<view class="myrealname-button">
			<ButtonBox :title="'实名认证'" :radius="'35rpx'" height="70rpx" width="650rpx" @hanldChange="hanldChange">
			</ButtonBox>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sex: '1', //性别
				phone: "", //电话
				realName: "", //姓名
				realIdType: "ID100001", //证件类型
				nationality: this.$Mock.nation_data[0].name, //民族
				realIdCode: "", //身份证号
				provinces: "", //省市区
				address_detail: "", //详情地址
				mockList: this.$Mock.nation_data
			};
		},
		onLoad(options) {
			let self = this;
			let userData = self.$getStorageSync('userData')
			if (typeof(userData) == "undefined") {
				uni.showModal({
					title: "提示",
					content: "请先登录授权~",
					success: function(res) {
						if (res.confirm) {
							uni.switchTab({
								url: "/pages/tabbar/my/index?pageId=send"
							})
						}
					}
				})
				return false;
			}
			self.getPhoneData()
		},
		components: {
			// mpvueCityPicker
		},
		computed: {

		},
		methods: {
			showMulLinkageThreePicker() {},
			getPhoneData() {
				let self = this;
				let userData = JSON.parse(self.$getStorageSync('userData'))
				this.phone = userData.phone
				let _data = {
					phone: userData.phone,
					guid: ''
				}
				this.$api.getRealId(_data).then(res => {
					if (res.code == 200 && res.data != null) {
						console.log(res)
						self.sex = res.data.sex;
						self.realName = res.data.realName;
						self.realIdType = res.data.realIdType;
						self.nationality = res.data.national;
						self.realIdCode = res.data.realIdCode;
						self.address_detail = res.data.realIdAddress;
					}
				})
			},
			onConfirm(e) {
				this.provinces = e.label.replace(/-/ig, '/');
			},
			// 实名认证
			hanldChange() {
				if (this.phone == '') {
					uni.showToast({
						icon: "none",
						title: "电话为空"
					});
					return;
				} else {
					if (!this.$Reg.RegPhone(this.phone)) {
						uni.showToast({
							icon: "none",
							title: "寄件电话输入有误"
						});
						return;
					};
				}
				if (this.realName == '') {
					uni.showToast({
						icon: "none",
						title: "姓名为空"
					});
					return
				};
				if (!this.$Reg.RegCard(this.realIdCode)) {
					uni.showToast({
						icon: "none",
						title: "身份证输入有误"
					});
					return
				};
				let new_provinces = this.provinces;
				let data = {
					realIdAddress: this.address_detail,
					realIdType: this.realIdType,
					realName: this.realName,
					phone: this.phone,
					national: this.nationality,
					sex: this.sex,
					realIdCode: this.realIdCode
				}
				this.$api.addAuth(data).then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: "success",
							title: res.message,
							duration: 2000
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					}
				})
			},
			// 性别
			radioChange(event) {
				this.sex = event.detail.value;
				console.log(this.sex)
			},
			// 民族选择回调
			bindPickerChange(e) {
				let val = e.detail.value;
				this.nationality = this.$Mock.nation_data[val].name;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myrealname {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #ffffff;
		// padding: 0 20rpx;
		padding: 0 20rpx;
		position: relative;

		.tips {
			display: inline-block;
			background-color: $ztd-color-primary;
			color: $ztd-color-block;
			width: 100rpx;
			height: 42rpx;
			line-height: 42rpx;
			text-align: center;
			border-radius: 21rpx;
		}

		&-item {
			display: flex;
			flex-direction: column;

			&-list {
				display: flex;
				height: 90rpx;
				border-bottom: 2rpx solid $ztd-color-line;
				align-items: center;
				padding: 0 20rpx;

				.flexRow {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				&-name {
					flex-wrap: nowrap;
					width: 180rpx;
					// font-size: 28rpx;
					// font-size: 28rpx;
					color: $ztd-color-titlefont;

				}

				.checkbox {
					flex: 1;

					radio-group {
						width: 100%;
						display: flex;
						justify-content: flex-start;
						align-items: center;
					}

					.radio {
						display: flex;
						align-items: center;
					}

				}

				input {
					flex: 1;
					// font-size: 26rpx!important;
					padding: 0 20rpx;
					color: $ztd-color-listfont;
				}
			}
		}

		&-button {
			// height:100rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20rpx;
		}

		.myrealname-button {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
