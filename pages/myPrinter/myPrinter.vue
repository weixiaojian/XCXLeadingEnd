<template>
	<view class="print">
		<!-- 当前连接设备 -->
		<TabLists>
			<view class="Connecting">
				当前连接设备：
				<view class="Connecting-flex">
					<view class="Connecting-name">{{ GET_BLE_DATA.name}}</view>
					<view class="button-wraper">
						<view :class="GET_CONNECT_DEVICEId ? 'search-cted-selected' : 'search-cted'">
							{{GET_CONNECT_DEVICEId?"已连接":"未连接"}}
						</view>
						<view class="break-off" @click="closeBle" v-if="GET_CONNECT_DEVICEId">
							断开连接
						</view>
					</view>
				</view>
			</view>
		</TabLists>
		<!-- <TabLists>
			<view>已添加蓝牙列表</view>
		</TabLists> -->
		<!-- 附近设备 -->
		<TabLists>
			<view class="print-nearby">
				<view class="print-nearby-title">已匹配设备:</view>
				<view class="print-nearby-list">
					<!-- 
						name： 设备名称
						deviceId： 设备ID
						connectedDeviceId： 连接状态
					 -->
					<view v-for="(item, index) in blePrint" :key="index" class="print-nearby-list-search"
						@tap="connectTo(item)">
						<view v-if="item.name" class="search-titID">
							{{ item.name }}
						</view>
						<view :class="GET_CONNECT_DEVICEId == item.deviceId ? 'search-cted-selected' : 'search-cted'">
							{{GET_CONNECT_DEVICEId == item.deviceId?"已连接":"未连接"}}
						</view>
					</view>
				</view>
			</view>
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
		<!--  -->
		<view class="model">支持的型号：汉印-HM-A300、启锐-LTK-130B-7DA8、济强-SUR888、优博讯-printer-5A30、T1、T2</view>
		<!-- 搜索设备/关闭蓝牙/打印测试 -->
		<view class="print-btn">
			<view class="print-btn-tab" @click="searchBle">搜索蓝牙</view>
			<view class="print-btn-tab" @click="closeBle">关闭蓝牙</view>
			<view class="print-btn-tab" @click="printBle">打印测试</view>
		</view>
		<animation-auth-modal ref="layerModel"></animation-auth-modal>
	</view>
</template>

<script>
	// 配置蓝牙
	import QRPrinter from '@/common/wxQRPrinter/QRPrinterAndTest.js';
	import tpl from '@/common/wxQRPrinter/utils/printTpl.js';
	import tpl_handler from '@/common/wxQRPrinter/utils/printTpl_parsing.js';
	// 当前当前连接蓝牙值和已连接和蓝牙状态
	import {
		GET_BLE_DATA,
		GET_BLE_DATA_PRINT,
		GET_CONNECT_DEVICEId,
		GET_BLE_DATA_PRINT_LIST
	} from "@/store/gettersType.js";
	import {
		SET_BLE_DATA,
		SET_BLE_DATA_PRINT,
		SET_CONNECT_DEVICEId,
		SET_BLE_DATA_PRINT_LIST
	} from "@/store/actionsType.js";
	import {
		mapActions,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				searchList: [], // 搜素到的蓝牙设备列表
				order_data: [{
					orderBill: '100009319371', // 订单号
					billcode: '29349234982349', // 运单号
					registerDate: '2021-5-18', // 订单录入日期
					twoCode: '102', // 二段码
					threeCode: 'T052', // 三段码
					fourCode: '01', // 四段码
					destinationCenter: '', // 目的分拨中心名称
					//destinationCenterCode: '',	// 目的分拨中心CODE
					sendProvince: '广东省', // 寄件省
					sendCity: '深圳市', // 寄件市
					sendCounty: '宝安区', //  寄件区
					sendTown: '新安街道', //  寄件街道
					sendManAddress: '中粮大厦商务公园', // 寄件详细地址
					sendMan: '张三寄件人', // 寄件人
					sendManMobile: '131000000000', // 寄件手机号
					sendManCompany: '深圳智腾达有限公司', // 寄件公司
					acceptProvince: '广东省', // 收件省
					acceptCity: '深圳市', //  收件市
					acceptCounty: '西乡区', // 收件区
					acceptTown: '测试街道', //  收件街道
					acceptManAddress: '测试详细地址', // 收件详细地址
					acceptMan: '李四收件人', // 收件人
					acceptManMobile: '181000100001', // 收件手机号
					acceptManCompany: '测试公司', // 收件公司
					goodsName: '食品', // 物品名称
					remark: '韵达同城配相信你的之快' // 备注
				}],
				pageId: '',
				blePrint: [],
				preData: {}
			};
		},
		computed: {
			...mapGetters([GET_BLE_DATA, GET_BLE_DATA_PRINT, GET_CONNECT_DEVICEId, GET_BLE_DATA_PRINT_LIST])
		},
		onLoad(options) {
			console.log(options.pageId);
			this.pageId = options.pageId
			if (this.pageId == 'ddcx') {
				try {
					this.preData = JSON.parse(options.data)
				} catch (err) {
					console.log(err)
				}
			}
			console.log('GET_BLE_DATA_PRINT_LIST', this.GET_BLE_DATA_PRINT_LIST)
		},
		onShow() {
			let self = this;
			uni.openBluetoothAdapter({
				success(res) {
					console.log(res)
					//获取本机蓝牙适配器状态
					uni.getBluetoothAdapterState({
						success: function(res) {
							console.log(res)
						},
					})
				}
			})
			self.blePrint = self.$getStorageSync('blePrint') || [];
		},
		methods: {
			...mapActions([SET_BLE_DATA, SET_BLE_DATA_PRINT, SET_CONNECT_DEVICEId, SET_BLE_DATA_PRINT_LIST]),
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
			// 手动关闭蓝牙
			closeBle() {
				QRPrinter.disconnect();
				this.searchList = [];
				this.SET_BLE_DATA({
					name: "请先连接蓝牙",
					deviceId: ""
				});
				this.SET_BLE_DATA_PRINT({});
				this.SET_CONNECT_DEVICEId("");
			},
			// 打印测试
			printBle() {
				let YDTCL = [
					"! 0 200 200 950 1\r\n",
					"PW 608\r\n",
					"GAP-SENSE\r\n",
					"TEXT 24 0 480 35 同城\r\n",
					"TEXT 24 0 480 65 特快\r\n",
					"BOX 460 32 545 97 2\r\n",
					// "EG 10 90 20 10 ",
					// 画整个边框()
					"LINE 0 97 550 97 2\r\n",
					"TEXT 55 11 0 80 2017-20-52 44:55:77\r\n",
					"SETMAG 3 3\r\n",
					// "SETBOLD 1\r\n",
					// 四段码并设置粗体指令：SETBOLD 、字符放大指令：<SETMAG >
					"TEXT 24 0 0 115 th52 a120 a666\r\n",
					// "SETBOLD 0\r\n",
					"SETMAG 1 1\r\n",
					// "SETBOLD 1\r\n",
					// "SETMAG 2 2\r\n",
					// "SETMAG 0 0\r\n",
					// "SETBOLD 0\r\n", 
					// "T 55 11 15 135 {{oneCode}} {{twoCode}} {{threeCode}} {{fourCode}}\n",
					"LINE 0 190 550 190 2\r\n",
					// 横向条形码及单号
					"BARCODE 128 3 40 110 5 200 LTk4656451651\r\n",
					"TEXT 24 0 172 320 4561155494851\r\n",
					"LINE 0 350 550 350 2\r\n",
					// 收件地址
					"SETMAG 2 2\r\n",
					// "SETBOLD 1\r\n",
					"TEXT 55 11 5 360 广东省深圳市宝安区永丰社区{{cut|35|13}}\r\n",
					// 四段码并设置粗体指令：SETBOLD 、字符放大指令：<SETMAG >
					// "TEXT 2 0 0 120 {{oneCode}} {{twoCode}} {{threeCode}} {{fourCode}}\r\n",
					// "SETBOLD 0\r\n",
					"SETMAG 1 1\r\n",
					"LINE 0 470 440 470 2\r\n",
					"SETMAG 3 3\r\n",
					// 集
					"TEXT 55 11 11 485 集\r\n",
					// 收
					"TEXT 55 11 11 565 收\r\n",
					"INVERSE-LINE 0 560 60 560 60\r\n",
					// 寄
					"TEXT 55 11 11 695 寄\r\n",
					"SETMAG 2 2 \r\n",
					// 集
					"BOX 0 480 60 540 2\r\n",
					// 收
					// "BOX 0 560 60 620 2\r\n",
					// 寄
					"BOX 0 690 60 750 2\r\n",
					// 派件分拨
					"SETMAG 2 2\r\n",
					"SETBOLD 1\r\n",
					"TEXT 55 11 80 490 西乡分拨中心\r\n",
					"SETBOLD 0\r\n",
					"SETMAG 1 1\r\n",
					"LINE 0 550 440 550 2\r\n",
					// 收件人
					"TEXT 24 0 80 555 gyb456\r\n",
					// 收件电话
					"TEXT 24 0 240 555 27478155522\r\n",
					// 收件地址
					"SETBOLD 1\r\n",
					"TEXT 24 0 80 590 广东省深圳市宝安区西乡街道永丰社区4区45{{cut|25|14}}\r\n",
					"SETBOLD 0\r\n",
					"LINE 0 680 440 680 2 \r\n",
					// 寄件人
					"TEXT 24 0 80 690 gyb1\r\n",
					// 寄件电话
					"TEXT 24 0 240 690 13724287633\r\n",
					// 寄件地址
					"TEXT 24 0 80 725 广东省深圳市宝安区西乡街道451154679{{cut|25|14}}\r\n",
					"LINE 0 815 550 815 2\r\n",
					"LINE 440 350 440 815 2\r\n", //竖线
					// 备注
					"TEXT 24 0 11 820 备注：\r\n",
					"TEXT 24 0 11 850 无{{cut|25|14}}\r\n",
					// 物品类型
					"TEXT 24 0 380 820 物品类型：\r\n",
					"TEXT 24 0 380 850 文件{{cut|25|8}}\r\n",
					// 纵向条形码
					"VBARCODE 128 2 50 90 475  810 lhj4165152132145\r\n",
					"TEXT270 24 0 470 530 456121654654\r\n",
					"ENDML\r\n",
					"SETSP 0\r\n",
					"FORM\r\n",
					"PRINT\r\n"
				]
				let BZKDLE3 = [
					"! 0 200 200 1200 1\r\n",
					"PW 608 \r\n",
					"GAP-SENSE\r\n",
					// 画整个边框()
					// "BOX 0 10 560 900 2 ",
					"SETMAG 2 2\r\n",
					"T 55 11 30 70 标准快递\r\n",
					"SETMAG 1 1 \r\n",
					"T 55 11 20 110 2021-07-07 20:49:81\r\n",
					"B 128 2 20 100 200 20 Lh45612\r\n",
					"T 24 1 260 125 45651215\r\n",
					"LINE 0 155 560 155 2\r\n",
					"LINE 185 10 185 155 2\r\n", //竖线
					"LINE 0 215 560 215 2\r\n",
					// "SETBOLD 1\r\n", 
					// "SETMAG 1 1 \n",
					"T 24 0 5 225 收件人:\r\n", //收件人信息
					"T 24 0 100 225 gyb1234\r\n",
					"T 24 0 300 225 13724287633\r\n",
					"T 24 0 5 260 地址:\r\n",
					"T 24 0 90 260 广东省深圳市宝安区永丰社区4区39栋701{{cut|32|19}}\r\n",
					// "SETBOLD 0\r\n",
					"SETMAG 1 1 \n",
					"LINE 0 330 560 330 2\r\n",
					"LINE 0 340 560 340 2\r\n",
					"T 24 0 5 345 寄件人:\r\n", //寄件人信息
					"T 24 0 100 345 gyb123\r\n", //寄件人信息
					"T 24 0 250 345 电话:\r\n",
					"T 24 0 320 345 13724287633\r\n",
					"T 24 0 5 375 地址:\r\n",
					"T 24 0 70 375 广东省深圳市宝安区永丰社区4区39栋701{{cut|25|30}}\r\n",
					"LINE 0 400 560 400 2\r\n",
					"T 24 0 5 405 实际重量:\r\n", //实际重量
					"T 24 0 120 405 50\r\n", //
					"T 24 0 5 435 体积(cm):\r\n", //体积(cm)
					"T 24 0 120 435 40\r\n", //体积(cm)
					"T 24 0 5 465 邮费:\r\n", //邮费
					"T 24 0 120 465 40\r\n", //邮费
					"T 24 0 180 465 保价金额:\r\n", //保价金额
					"T 24 0 295 465 600\r\n", //保价金额
					"T 24 0 5 495 其他费用:\r\n", //其他费用
					"T 24 0 120 495 500\r\n", //其他费用
					"T 24 0 180 495 实收费用:\r\n", //实收费用
					"T 24 0 295 495 600\r\n", //实收费用
					"LINE 0 525 560 525 2\r\n",
					"T 24 0 5 530 收件人\代收人:\r\n", //收件人\代收人
					"T 24 0 180 530 gyb12\r\n", //收件人\代收人
					"T 24 0 5 560 签收时间:\r\n", //签收时间
					"T 24 0 125 560 2021\r\n", //签收时间 
					"T 24 0 175 560 年\r\n", //年
					"T 24 0 205 560 09\r\n", //签收时间
					"T 24 0 230 560 月\r\n", //月
					"T 24 0 255 560 22\r\n", //签收时间
					"T 24 0 280 560 日\r\n", //日
					"T 24 0 5 590 快件送达收货人地址，经收件人或收件人允许的代收人签字，视为送达{{cut|28|22}}\r\n", //代签收提示
					"LINE 0 650 560 650 2\r\n",
					"T 24 0 5 665 内件品名:\r\n", //内件品名
					"T 24 0 120 665 文件:\r\n", //内件品名
					"T 24 0 200 665 公司名称:\r\n", //公司名称
					"T 24 0 310 665 党纪国法了解\r\n", //公司名称
					"LINE 0 700 560 700 2\r\n",
					"T 24 0 5 705 件数\r\n", //件数
					"T 24 0 60 705 1\r\n", //件数
					"T 24 0 130 705 重量\r\n", //重量
					"T 24 0 190 705 5\r\n", //重量
					"T 24 0 240 705 订单编号\r\n", //订单编号
					"T 24 0 340 705 lj45612315487\r\n", //订单编号
					"T 24 0 5 740 配货信息:\r\n", //订单编号
					"T 24 0 120 740 行家和加沙局势都干啥高档的{{cut|28|16}}\r\n", //订单编号
					"LINE 0 810 560 810 2\r\n",
					"B 128 2 20 90 20 830 Lh4564612\r\n",
					"T 24 1 50 930 4565546516165161215\r\n",
					"LINE 0 960 560 960 2\r\n",
					"T 24 0 5 965 备注:\r\n", //备注
					"T 24 0 60 965 请带上手提袋~~~~\r\n", //件数
					"LINE 0 1100 560 1100 2\r\n",
					"T 24 0 25 1110 网址:\r\n", //网址
					"T 55 11 100 1115 www.ems.com.cn\r\n", //网址
					"T 24 0 230 1110 客服电话:\r\n", //客服电话
					"T 24 0 340 1110 11183\r\n", //
					"LINE 470 1100 470 1140 2\r\n", //竖线
					"LINE 0 1140 560 1140 2\r\n",
					"ENDML\r\n",
					"SETSP 0\r\n",
					"FORM\r\n",
					"PRINT\r\n"
				]
				let BZKDLE2 = [
					"! 0 200 200 950 1\r\n",
					"PW 608 \r\n",
					"GAP-SENSE\r\n",
					// 画整个边框()
					"BOX 0 10 560 900 2 \r\n",
					"B 128 2 20 100 50 20 JDV46465156465\r\n",
					"TEXT 24 1 200 125 JDV46465156465\r\n",
					"TEXT 24 0 500 150 4KG\r\n", //条形码编号
					"LINE 0 180 560 180 2 \r\n",
					"TEXT 24 0 5 185 始发地:\r\n", //始发地
					"TEXT 24 0 85 185 上海浦东分拣中心\r\n", //始发地
					"SETMAG 3 3 \r\n",
					"TEXT 55 11 30 210 K40-Y3-39\r\n",
					"SETMAG 0 0 \r\n",
					"TEXT 24 0 310 185 目的地:\r\n", //始发地
					"TEXT 24 0 400 185 昆明分拣中心\r\n", //始发地
					"SETMAG 3 3 \r\n",
					"TEXT 55 11 330 210 K40-Y35\r\n",
					"SETMAG 0 0 \r\n",
					"LINE 300 180 300 320 2\r\n", //竖线
					"LINE 0 260 560 260 2\r\n",
					"SETBOLD 1\r\n",
					"TEXT 1 11 80 270 昆明茨垻营业部\r\n",
					"SETBOLD 0\r\n",
					"LINE 0 320 560 320 2\r\n",
					"TEXT 24 0 315 280 006\r\n",
					"TEXT 24 0 430 280 1/1\r\n",
					"LINE 370 260 370 460 2\r\n", //竖线
					"LINE 70 260 70 460 2\r\n", //竖线
					"TEXT 24 0 15 330 客户信息{{cut|30|1}}\r\n",
					"TEXT 24 0 75 330 广东省深圳市宝安区西乡街道永丰社区7栋506{{cut|30|13}}\r\n",
					"TEXT 24 0 75 400 黄云\r\n",
					"TEXT 24 0 250 400 13724287633\r\n",
					"ENDML\r\n",
					"SETSP 0\r\n",
					"FORM\r\n",
					"PRINT\r\n"
				]
				// 先判断蓝牙连接状态
				QRPrinter.getConnectState((resState) => {
					if (resState.state && resState.code == 200) {
						// 打印数据 -- 设置数据传入动态的
						// let buffs = tpl['韵达同城联'].join('')
						// let buffs = tpl_handler(YDTCL, {})
						// let prints = buffs.join('')
						// // QRPrinter.printWriteBLE(this.order_data[0])
						// QRPrinter.sendCmd(prints)
						for(let d=0;d<this.order_data.length;d++) {
							// QRPrinter.printWriteBLE(this.order_data[d])
							let buffs = tpl_handler(tpl['韵达同城联'],this.order_data[d])
							buffs.join('')
							QRPrinter.sendCmd(buffs)
						}
					}
				});
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

				if (self.GET_BLE_DATA.deviceId) {
					self.$toast('当前已连接设备,请先手动断开')
					return
				}

				QRPrinter.connect(item, function(res) {
					console.log('item', res);
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
						// if(self.GET_BLE_DATA_PRINT_LIST.incl)
						let printAarry = []
						if (self.GET_BLE_DATA_PRINT_LIST.length > 0) {
							self.GET_BLE_DATA_PRINT_LIST.forEach(item => {
								if (item.deviceId != res.device.deviceId) {
									printAarry.push({
										name: res.device.name,
										deviceId: res.device.deviceId
									})
									self.blePrint = printAarry
									console.log(self.blePrint)
									self.SET_BLE_DATA_PRINT_LIST(printAarry)
									self.$setStorageSync('blePrint', printAarry)
								}
							})
						} else {
							printAarry.push({
								name: res.device.name,
								deviceId: res.device.deviceId
							})
							self.blePrint = printAarry
							console.log(self.blePrint)
							self.SET_BLE_DATA_PRINT_LIST(printAarry)
							self.$setStorageSync('blePrint', printAarry)

						}
						console.log(self.GET_BLE_DATA_PRINT_LIST)
						// 连接成功自动返回上个页面
						if (self.pageId == 'ddcx') {
							setTimeout(() => {
								getApp().globalData.currentIndex = 1;
								// let pages = getCurrentPages()
								// let perpage = pages[pages.length - 2]
								// perpage.$vm.tabList[self.preData.tabIndex] = self.preData.printlist
								// perpage.$vm.tabIndex = self.preData.tabIndex;
								uni.switchTab({
									url: '/pages/tabbar/inquire/index'
								})
							}, 500)
						}
					}
				}, function(err) {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss">
	.print {
		position: relative;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding-bottom: 140rpx;

		.model {
			margin-top: 20rpx;
			padding: 0 50rpx;
		}

		.break-off {
			height: 40rpx;
			line-height: 40rpx;
			width: 130rpx;
			border-radius: 8rpx;
			color: #fdd605;
			font-size: 30rpx;
			text-align: center;
			background-color: #515151;
			margin-top: 12rpx;
		}

		.button-wraper {
			display: flex;
			margin: 0 10rpx;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		.Connecting {
			width: 100%;
			display: flex;
			align-items: center;

			&-flex {
				flex: 2;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			&-name {
				font-size: 30rpx;
				margin-left: 10rpx;
			}
		}

		.search-cted-selected {
			color: $ztd-color-back;
			background-color: $ztd-color-primary;
		}

		.search-cted {
			color: $ztd-color-primary;
			border: 2rpx solid $ztd-color-primary;
		}

		.search-cted,
		.search-cted-selected {
			font-size: 30rpx;
			width: 100rpx;
			height: 40rpx;
			text-align: center;
			border-radius: 8rpx;
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
				max-height: 500rpx;
				overflow-y: auto;

				&-search {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 30rpx;

					.search-titID {
						font-size: 30rpx;

						text {
							margin-left: 10rpx;
							font-size: 32rpx;
							font-weight: 700;
						}
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
				width: 29%;
				text-align: center;
				padding: 25rpx 0;
				background-color: $ztd-color-primary;
				box-shadow: $ztd-shadow;
				font-size: 30rpx;
				color: $ztd-color-back;
				border-radius: $ztd-border-radius;
				margin-right: 10rpx;
			}
		}
	}
</style>
