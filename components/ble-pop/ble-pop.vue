<template>
	<view class="print">
		<TabLists>
			<view class="Connecting">当前连接设备：{{ GET_BLE_DATA.name }}</view>
		</TabLists>
		<TabLists>
			<view class="print-nearby">
				<view class="print-nearby-title">附近设备:</view>
				<view class="print-nearby-list">
					<!-- 
						name： 设备名称
						deviceId： 设备ID
						connectedDeviceId： 连接状态
					 -->
					<view v-for="(item, index) in searchList" :key="index" class="print-nearby-list-search"
						@tap="connectTo(item)">
						<view v-if="item.name" class="search-titID">
							{{ item.name }}<text>{{ item.deviceId  | filterBleMP}}</text>
						</view>
						<view :class="GET_CONNECT_DEVICEId == item.deviceId ? 'search-cted-selected' : 'search-cted'">
							{{GET_CONNECT_DEVICEId == item.deviceId?"已连接":"未连接"}}
						</view>
					</view>
				</view>
			</view>
		</TabLists>
		<view class="print-btn">
			<view class="print-btn-tab" @click="searchBle">搜索蓝牙</view>
		</view>
		<animation-auth-modal ref="layerModel"></animation-auth-modal>
	</view>
</template>

<script>
	// 配置蓝牙
	import QRPrinter from '@/common/wxQRPrinter/QRPrinterAndTest.js';
	// 当前当前连接蓝牙值和已连接和蓝牙状态
	import {
		GET_BLE_DATA,
		GET_BLE_DATA_PRINT,
		GET_CONNECT_DEVICEId
	} from "@/store/gettersType.js";
	import {
		SET_BLE_DATA,
		SET_BLE_DATA_PRINT,
		SET_CONNECT_DEVICEId
	} from "@/store/actionsType.js";
	import {
		mapActions,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				searchList: [], // 搜素到的蓝牙设备列表
			}
		},
		computed: {
			...mapGetters([GET_BLE_DATA, GET_BLE_DATA_PRINT, GET_CONNECT_DEVICEId])
		},
		methods: {
			...mapActions([SET_BLE_DATA, SET_BLE_DATA_PRINT, SET_CONNECT_DEVICEId]),
			
			// 搜索蓝牙
			searchBle() {
				//微信内置定位
				wx.getSetting({
					success: (res) => {
						wx.getSystemInfo({
							success: (resTo) => {
								// 微信定位权限开启
								if (!res.authSetting['scope.userLocation']) {
									//打开提示框，提示前往微信设置
									this.$refs.layerModel.openModal();
								} else if (!resTo.locationEnabled) {
									this.$toast('请开启手机GPS权限再搜索设备');
								} else {
									// 设置节流-当持续触发事件时，保证一定时间段内只调用一次事件处理函数
									this.$throttle(() => {
										this.openSearchBle();
									}, 500);
								}
							}
						})
					}
				})
			},
			
			// 搜索蓝牙
			openSearchBle() {
				let self = this;
				self.searchList = [];
			
				// 搜索蓝牙
				QRPrinter.searchBle(function(devices) {
					// console.log('devices', devices);
					self.searchList = devices
				})
			},
			// 连接蓝牙
			connectTo(item) {
				let self = this;
				
				if(self.GET_BLE_DATA.deviceId) {
					self.$toast('当前已连接设备,请先手动断开')
					return
				}
				
				QRPrinter.connect(item, function(res) {
					// console.log('item', res.device);
					// 自定义返回值
					if (res.code == 200) {
						// 存入已连接的设备ID与搜索的数组列表其中的设备ID
						self.SET_CONNECT_DEVICEId(res.device.deviceId);
						// 存入当前连接设备
						self.SET_BLE_DATA({
							name: res.device.name,
							deviceId: res.device.deviceId
						});
						// 存入已连接设备列表 -- 暂时不用
						self.SET_BLE_DATA_PRINT({
							name: res.device.name,
							deviceId: res.device.deviceId
						});
						// 代表这连接成功传值到需要打印页面
						uni.$emit('bleOk', true);
						
					}
				}, function(err) {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.print {
		position: relative;
		width: 100%;
		height: 800rpx;
		background-color: $ztd-color-white;
		border-radius: 18rpx 18rpx 0 0 ;
	
		.Connecting {
			font-size: 32rpx;
		}
	
		.print-nearby {
			width: 100%;
	
			&-title {
				margin-bottom: 40rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
	
			&-list {
				width: 100%;
				padding-left: 30rpx;
				max-height: 400rpx;
				overflow-y: auto;
	
				&-search {
					display: flex;
					align-items: center;
					justify-content: space-between;
	
					.search-titID {
						font-size: 30rpx;
						margin-bottom: 30rpx;
	
						text {
							margin-left: 10rpx;
							font-size: 32rpx;
							font-weight: 700;
						}
					}
	
					.search-cted {
						color: $ztd-color-primary;
						border: 2rpx solid $ztd-color-primary;
					}
	
					.search-cted-selected {
						color: $ztd-color-back;
						background-color: $ztd-color-primary;
					}
	
					.search-cted,
					.search-cted-selected {
						margin-bottom: 30rpx;
						font-size: 30rpx;
						width: 100rpx;
						height: 40rpx;
						text-align: center;
						border-radius: 8rpx;
					}
				}
			}
		}
	
		.print-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 30rpx;
			left: 0;
			right: 0;
	
			&-tab {
				width: 87%;
				text-align: center;
				padding: 25rpx 0;
				background-color: $ztd-color-primary;
				box-shadow: $ztd-shadow;
				font-size: 32rpx;
				color: $ztd-color-back;
				border-radius: $ztd-border-radius;
				margin-right: 10rpx;
			}
		}
	}
</style>
