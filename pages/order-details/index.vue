<template>
	<view class="orderDetails">
		<view class="map-wraper">
			<map :latitude="latitude" v-if="mapOn" :scale="scales" enable-zoom="'true'" enable-scroll="'true'"
				:longitude="longitude" show-location="true" :markers="covers"></map>
		</view>
		<view class="top-wraper">
			<view class="topbill-t">
				<view class="bill" v-if="billCode">
					运单号:{{billCode}}
					<image @click="copy(billCode)" class="copy" src="../../static/img/copy.png" mode=""></image>
				</view>
				<view class="bill" v-if="!billCode">
					订单号:{{detailsData.orderBill}}
					<image @click="copy(detailsData.orderBill)" class="copy" src="../../static/img/copy.png" mode=""></image>
				</view>
				<view class="r" @click="goelEctronStub" v-if="isSelf">订单详情 <i class="iconfont rightIcon"
						v-html="'&#xe645;'"></i></view>
			</view>
			<view class="topbill-b" v-if="sendCity||detailsData.sendCity">
				<view class="contl uni-ellipsis">
					{{sendCity||detailsData.sendCity}}
				</view>
				<view class="contc">
					<view class="line"></view>
					<view class="decs">{{billStatus||detailsData.billStatus}}</view>
				</view>
				<view class="contr uni-ellipsis">
					{{recCity||detailsData.acceptCity}}
				</view>
			</view>
		</view>
		<!-- 	<view class="imgbox">
				<image src="" mode=""></image>
			</view> -->
		<!-- 		<view class="bot-wraper" v-if="detailsData.sendSite">
			<view class="l">
					<view class="row-p">
						{{detailsData.sendSite+'  '||''}} {{detailsData.recMan+'  '||''}} 
					</view>
				</view>
			</view> -->
		<!-- 	<view class="r">
				<view class="imgbox">
					<image src="" mode=""></image>
				</view>
				<text>联系小哥</text>
			</view> -->
		<view class="unlist" v-if="hasBill">
			<image src="/static/img/undata.png" alt="" />
			<view>暂无轨迹数据~</view>
		</view>
		<view class="steps-wraper" v-else>
			<!--  wx:for='{{billTrack}}' wx:key="index" data-id='{{index}}' -->
			<view class="track_wraper" v-for="(item,index) in trackData" :key="index">
				<view class="time">
					<view class="view-p">{{item.scanDate2}}</view>
					<view class="view-p">{{item.scanDate3}}</view>
				</view>
				<view class="express_word">
					<text class="express_word_icon"></text>
					<view class="express_word_text">
						<!-- <view class="view-p" ><text class="mgr_5">【xxxxxxx】</text>已收件,取件人:xxxxxxx</view> -->
						<view class="view-p" v-if="item.scanType=='收件'"><text
								class="mgr_5">【{{item.scanSite||''}}】</text>已收件,取件人:{{item.scanMan||''}}({{item.phone||''}})
						</view>
						<view class="view-p" v-if="item.scanType=='到件'">快件到达<text
								class="mgr_5">【{{item.scanSite||''}}】</text></view>
						<view class="view-p" v-if="item.scanType=='发件'"><text
								class="mgr_5">【{{item.scanSite||''}}】</text>已发出,准备发往<text
								class="mgr_5">【{{item.preOrNextStation||''}}】</text></view>
						<view class="view-p" v-if="item.scanType=='派件'"><text
								class="mgr_5">【{{item.scanSite||''}}】</text>派件中, 派件人: <text
								class="mgr_5">【{{item.scanMan||''}}】</text>,电话:<text
								class="mgr_5">【{{item.phone||''}}】</text>如有疑问,请联系:<text
								class="mgr_5">【{{item.preOrNextStation||''}}】</text></view>
						<view class="view-p" v-if="item.scanType=='签收'">您的快件已在<text
								class="mgr_5">【{{item.scanSite||''}}】</text>签收,签收人： {{item.scanMan||''}}，如有疑问请联系:
							{{item.phone||''}}, 投诉电话：{{item.preOrNextStation||''}}</view>
						<view class="view-p" v-if="item.scanType=='问题件'">快件已进行<text
								class="mgr_5">【{{item.scanType||''}}】</text>登记,登记网点是【{{item.scanSite||''}}】，登记人是【{{item.scanMan||''}}】;</view>
						<view class="view-p" v-if="item.scanType=='异常签收'">快件已<text
								class="mgr_5">【{{item.scanType||''}}】</text>,签收网点是【{{item.scanSite||''}}】，签收人是【{{item.scanMan||''}}】;</view>
						<view class="view-p" v-if="item.scanType=='退件'">快件已做<text
								class="mgr_5">【{{item.scanType||''}}】</text>,录入网点是【{{item.scanSite||''}}】，退件人是【{{item.scanMan||''}}】;</view>
						<view class="view-p" v-if="item.scanType=='拦截'">快件已
							<text class="mgr_5">
								【{{item.scanType||''}}】
							</text>,快件在【{{item.scanSite||''}}】进行运单拦截操作;
						</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				billCode: '',
				latitude: '',
				longitude: '',
				covers: [],
				hasBill: true,
				detailsData: {},
				pageId: '',
				type: '',
				orderCode: '',
				trackData: [],
				mapOn: false,
				scales: 4,
				isSelf: false,
				sendCity: '',
				recCity: '',
				billStatus: ''
			}
		},
		onLoad(option) {
			let self = this
			let _self = this
			let data = JSON.parse(option.data);
			this.type = data.type;
			this.detailsData = data.item
			console.log(data.item)
			if (data.item) {
				if (data.isclick == 1) {
					this.isSelf = true;
				}
				this.mapOn = true;
			}
			if (data.billCode) {
				this.billCode = data.billCode;
				this.getTrackVOList(data.billCode);
			} else {
				console.log(data.item.orderBill)
				this.hasBill = true;
				this.getTrackVOList(data.item.orderBill);
			}
		},
		computed: {},
		onShow() {},
		methods: {
			goelEctronStub() {
				let _data = {
					type: this.type,
					billCode: this.billCode,
					item: this.detailsData
				}
				uni.navigateTo({
					url: "/pages/electron-stub/index?pageId=ddxq&data=" + JSON.stringify(_data)
				})
			},
			copy(text) {
				let self = this;
				uni.setClipboardData({
					data: text,
					success: function() {
						console.log('success');
					}
				});
			},
			getTrackVOList(code) {
				let self = this
				let data = {
					billCode: code
				}
				self.$api.getMapPath(data).then(res => {
					console.log(res)
					if (res.code == 200) {
						if (res.data.list.length > 0) {
							self.hasBill = false;
							self.trackData = res.data.list;
						}
						if (res.data.send) {
							self.latitude = (parseInt(res.data.send.latitude) + parseInt(res.data.rec.latitude)) /
								2;
							self.longitude = (parseInt(res.data.send.longitude) + parseInt(res.data.rec
								.longitude)) / 2;
						}
						if (res.data.billStatus) {
							this.billStatus = res.data.billStatus
						}
						if (res.data.sendCity) {
							this.sendCity = res.data.sendCity;
							this.recCity = res.data.recCity;
						} else {
							uni.showToast({
								title: '运单号查询有误~',
								icon: 'none',
								duration: 1500
							})
						}
						if (res.data.order) {
							self.detailsData = res.data.order
							self.isSelf = true;
						} else {
							self.detailsData = {};
							self.isSelf = false;
						}
						self.mapOn = true;
						self.covers = [{
								id: 0,
								content: '',
								latitude: res.data.send.latitude,
								longitude: res.data.send.longitude,
								iconPath: '../../static/img/marker_red.png',
								width: 20,
								height: 20,
							},
							{
								id: 0,
								content: '',
								latitude: res.data.rec.latitude,
								longitude: res.data.rec.longitude,
								iconPath: '../../static/img/marker_red.png',
								width: 20,
								height: 20,
							}
						]
					} else if (res.code == 400) {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 4000
						})
						this.hasBill = true
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.orderDetails {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		position: relative;

		.map-wraper {
			width: 100%;
			height: 1030rpx;

			map {
				width: 100%;
				height: 100%;
			}
		}

		.top-wraper,
		.bot-wraper {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			width: calc(100% - 40rpx);
			background-color: $ztd-color-white;
		}

		.top-wraper {
			position: absolute;
			padding: 20rpx 20rpx 0;
			top: 0;
			border-radius: 6rpx;
			min-height: 100rpx;

			.topbill-t,
			.topbill-b {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.topbill-t {
				.bill {
					display: flex;
					align-items: center;

					.copy {
						width: 36rpx;
						height: 36rpx;
						margin-left: 10rpx;
					}
				}

				.r {
					font-weight: bold;
					display: flex;
					align-items: center;

					.rightIcon {
						font-size: 26rpx;
						margin-left: 10rpx;
					}
				}
			}

			.topbill-b {
				padding: 10rpx 0;

				.contl,
				.contc,
				.contr {
					flex: 1;
					height: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
				}

				.contl,
				.contr {
					font-size: 30rpx;
					font-weight: bold;
				}

				.contc {
					justify-content: center;
					flex-direction: column;
					padding: 0 20rpx;

					.line {
						background-color: $ztd-color-primary;
						width: 100%;
						height: 2rpx;
						margin: 10rpx 0;
					}
				}
			}
		}

		.bot-wraper {
			top: 880rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;

			.l,
			.r {
				display: flex;
				align-items: center;

				.text {
					margin-left: 20rpx;

					.row-p:nth-child(2) {
						color: #999;
					}
				}
			}

			.imgbox {
				width: 50rpx;
				height: 50rpx;
			}
		}

		.steps-wraper {
			padding: 20rpx;
			.track_wraper {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;

				.time {
					width: 184rpx;
					height: 100%;
					border-right: .0625rem solid #ccc;
					color: #666;
					font-size: 26rpx;
					padding-bottom: 70rpx;

					.view-p:nth-child(2) {
						font-size: 24rpx;
					}
				}

				.express_word {
					position: relative;
					flex: 1;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					padding: 0 30rpx 0 60rpx;
					font-size: 24rpx;

					.express_word_icon {
						position: absolute;
						left: -16rpx;
						top: 0;
						display: block;
						width: 32rpx;
						height: 32rpx;
						border-radius: 16rpx;
						background-color: #ccc;
					}

					.express_word_text {
						width: 100%;
						height: auto;

						>.view-p {
							word-break: break-all;
							width: 100%;
							height: auto;
							font-size: 24rpx;
							color: #666;
						}
					}

					.mgr_5 {
						margin-right: 10rpx;
						color: $ztd-color-primary;
					}

					.mglr_5 {
						margin: 0 10rpx;
					}
				}
			}

			.track_wraper:last-child {
				.time {
					border-right: none;
				}
			}

			.track_wraper:first-child {
				.express_word_icon {
					width: 32rpx;
					height: 32rpx;
					border-radius: 16rpx;
					// background-image:url('../images/liwu.png')  no-repeat center;
					background-color: $ztd-color-primary;
					background-size: 65%;
				}
			}

		}

		.unlist {
			height: 480rpx;
			width: 100%;
			display: -webkit-box;
			display: -moz-box;
			display: -ms-flexbox;
			display: -weblit-flex;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			color: #666;
			border-radius: 6rpx;

			image {
				width: 228rpx;
				height: 196rpx;
				margin-bottom: 25rpx;
			}
		}

	}
</style>
