/**
 * 	@Author	戴祖华 - DaiZuHua
 *  @CreateDate 2021-5-20 🕛 凌晨 1-6点
 *  @Describe 低功耗蓝牙
 *  @Function 适用于所有蓝牙设备连接
 */
import store from '@/store/index.js'
import { SET_BLE_DATA, SET_CONNECT_DEVICEId } from '@/store/actionsType.js';
import { GET_CONNECT_DEVICEId } from '@/store/gettersType.js'
// const util = require("./libs/util");
const PrintUtil = require('./libs/printutil')
// import {TextEncoder} from './libs/encoding.js'

// let gbToBase64 = require("./utils/gb2312ToBase64.js").encode64
// let ToBase64 = require("./utils/base64gb2312.js").encode64gb2312
let BleUtil = require('./encode/BleUtil.js');

let searchList = []		// 存放搜索出的蓝牙设备数组
let currDev = null		// 存放连接成功的设备item
let connId				// 连接成功的设备ID
let sendData64 = []		// 已转换的打印数据
let uuid				// 特征值
let UUID_NOTIFY			// notify
let connectDevice
/**
 * 	打开蓝牙适配器并搜索
 * 	@param {Object} searchedPrinters	回调新搜索到的设备（数组）
 * 	步骤：
 * 		1、忘记打开蓝牙
 * 		2、没有打开定位功能
 * 		3、微信没有定位权限（在手机的权限设置里打开）
 */
function searchBle(searchedPrinters, fail) {
	uni.openBluetoothAdapter({ //初始化蓝牙模块
		success: function(res) {
			//监听寻找到新设备的事件
			onDevice(searchedPrinters)
			//获取本机蓝牙适配器状态
			uni.getBluetoothAdapterState({ 
				success: function(res) {
					console.log(res)
					if (res.available) {
						if (res.discovering) {
							stopFindBule()
						}
						//搜索蓝牙
						//开始搜寻附近的蓝牙外围设备
						console.log("开始搜寻附近的蓝牙外围设备")
						uni.startBluetoothDevicesDiscovery({
							success(res) {
								console.log(res)
							}
						})
					} else {
						console.log('本机蓝牙不可用')
					}
				},
			})
		},fail: function(err) {
			if (fail) fail(err)
			uni.showToast({
				icon: 'none',
				title: "请检查蓝牙是否打开",
				duration: 3000
			})
		}
	})
}

/**
 * 监听寻找到新设备的事件
 */
function onDevice(searchedPrinters) {
	console.log("监听寻找到新设备的事件---------------");

	uni.startBluetoothDevicesDiscovery({
		powerLevel: "high",			// 加快速度搜索
		allowDuplicatesKey: true,
		success: function(res) {
			uni.showLoading({
				title: '正在搜索中'
			});
			
			//监听寻找到新设备的事件
			uni.onBluetoothDeviceFound(function(devices) {
				
				console.log('-------new----------' + JSON.stringify(devices))
				
				var re = JSON.parse(JSON.stringify(devices))
				
				console.log(re.devices[0].name + "  " + re.devices[0].deviceId)
				
				let name = re.devices[0].localName
				// 判断搜索出的蓝牙名称
				if (name != "") {
					
					// 发现并添加新的设置
					let flag = false;
					if (searchList.length > 0) {
						searchList.forEach((item, i) => {
							if (item.name == name) {
								flag = true;
							}
						});
					}
					
					if(!flag) {
						
						let deviceId = re.devices[0].deviceId
						searchList.push({
							name: name,
							deviceId: deviceId,
							services: []
						})
					}
					// 回调搜索出的蓝牙信息
					searchedPrinters(searchList);
				}
				setTimeout(() => {
					uni.hideLoading()
				}, 1500)
			})
		}
	})
}

/**
 *  停止搜寻附近的蓝牙外围设备
 */
function stopFindBule() {
	uni.stopBluetoothDevicesDiscovery({
		success(res) {
			console.log(res)
		}
	})
}

/**
 * 连接蓝牙
 * @param {Object} item		连接的蓝牙对象
 * @param {Object} success	成功的回调
 * @param {Object} fail		失败的回调
 */
function connect(item, success, fail) {
	console.log("连接蓝牙---------------" + item.deviceId)
	
	let deviceId = item.deviceId
	uni.createBLEConnection({//连接低功耗蓝牙设备
		deviceId: deviceId,
		complete:function(res) {
			console.log(res)
			if (res.errMsg == "createBLEConnection:ok") {
				
				uni.showToast({
					icon:'none', 
					title: "连接蓝牙-" + item.name + "-成功"
				})
				// 连接的设备ID
				connId = deviceId;
				// 连接的蓝牙对象
				currDev = item;
				console.log('连接currDev--'+currDev)
				setTimeout(function() {
					getBLEServices(deviceId, success, fail)//获取蓝牙设备所有服务(service)
				}, 2000)
			} else {
				console.log(res)
			}
		},
	})
}

/**
 * 获取蓝牙设备所有服务(service) -- 主服务ID
 * @param {Object} _deviceId	连接设备ID
 * @param {Object} success		成功回调
 * @param {Object} fail			失败回调
 */
function getBLEServices(_deviceId, success, fail) {
	let deviceId = _deviceId
	console.log("获取蓝牙设备所有服务(service)")
	
	uni.getBLEDeviceServices({
		// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
		deviceId: deviceId,
		complete: function(res) {
			
			console.log(res)
			let serviceId = ""
			
			for (let s = 0; s < res.services.length; s++) {
				
				console.log(res.services[s].uuid)
				// 获取到的服务ID
				let serviceId = res.services[s].uuid
				
				// 获取蓝牙设备某个服务中所有特征值(characteristic)
				uni.getBLEDeviceCharacteristics({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: serviceId,
					success:function(res){
						console.log('特征');
						let re = JSON.parse(JSON.stringify(res))
						console.log('deviceId = [' + deviceId + ']  serviceId = [' + serviceId + ']')
						
						for (let c = 0; c < re.characteristics.length; c++) {
							// 写的操作
							if (re.characteristics[c].properties.write == true) {
								uuid = re.characteristics[c].uuid
								console.log(' deviceId = [' + deviceId + ']  serviceId = [' + serviceId + '] characteristics=[' + uuid)
								for (let index in searchList) {
									if (searchList[index].deviceId == deviceId) {
										searchList[index].services.push({
											serviceId: serviceId,
											characteristicId: uuid
										})
										break
									}
								}
							}
							// notify操作
							if(re.characteristics[c].properties.notify == true) {
								UUID_NOTIFY = re.characteristics[c].uuid
							}
						}
						// 判断设备ID、成功回调、获取的写的特征值存在 -- 获取特征成功才设置连接上
						if(serviceId && success && uuid && UUID_NOTIFY) {
							// 开启notify
							enableNotify(deviceId, serviceId, uuid, success);
						} else {
							if (fail) fail({ "msg": "失败" })
						}
					}
				})
				// 监听当前蓝牙连接状态
				getBLEConnStateChange();
			}
		},
		fail: function(res) {
			console.log(res);
		}
	})
}


/**
 * 	写操作模块 -- 开启写和通知
 *  @param {Object} deviceId
 *  @param {Object} serviceId
 */
function enableNotify(deviceId, serviceId, uuid, success) {
	
	console.log('启用notify' + deviceId + " / service:" + serviceId + " / char : " + UUID_NOTIFY);
	
	uni.notifyBLECharacteristicValueChange({
		deviceId,
		serviceId,
		characteristicId: UUID_NOTIFY,
		state: true,	// 开启
		success: function (res) {
			console.log('启用notify成功');
			
			listenReceive();
			
			uni.showToast({
				icon: 'none',
				title: '打印机已就绪'
			})
			 connectDevice = {
				name: currDev.name,
				deviceId,
				serviceId,
				CharacteristicId: uuid
			}
			success({
				msg: "成功",
				device: connectDevice,
				code: 200
			})
			//连接成功 关闭搜索
			stopFindBule()
		}, fail: function (e) {
			console.log('启用notify失败');
		}
	})
	
}

/**
 * 数据中心收到消息
 */
function listenReceive() {
	uni.onBLECharacteristicValueChange(function (res){
		console.log('数据中心收到消息：' + hexString)
	})
}

/**
 * 监听当前蓝牙连接状态
 */
function getBLEConnStateChange() {
	// 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
	uni.onBLEConnectionStateChange(function(res) {
		/**
		 * 	根据监听到设备ID与已连接设备ID--蓝牙断开
		 * 	deviceId: 蓝牙设备ID
		 *  connected: 是否处于已连接状态
		 *  connId: 当前连接设备ID
		 *  searchList: 蓝牙断开清空搜索的数组值
		 * 	store方法：
		 * 		store.dispatch(SET_BLE_DATA): 当前已连接设备
		 * 		store.dispatch(SET_CONNECT_DEVICEId): 当前连接的设备ID及状态
		 */
		console.log('state==>', res.deviceId, res.connected, connId)

		if (res.deviceId == connId && !res.connected) {
			store.dispatch(SET_BLE_DATA, {
				name: '请先连接蓝牙',
				deviceId: ""
			})
			store.dispatch(SET_CONNECT_DEVICEId, "")
			searchList = [];
			setTimeout(function() {
				uni.showToast({
					icon: 'none',
					title: '蓝牙已断开'
				});
			}, 1000)
		}
	})
}

/**
 * 获取已连接蓝牙状态 -- 要先连接蓝牙成功，connectDeviceId状态才有值
 * @param {Object} success
 * @param {Object} fail
 */
function getConnectState(success, fail,toast=true) {
	console.log('store.getters',store.getters.GET_CONNECT_DEVICEId)
	if (store.getters.GET_CONNECT_DEVICEId) {
		success && success({
			code: 200,
			state: true
		});
	} else {
		fail && fail({
			code: 404,
			state: false
		});
		if(toast){
			uni.showToast({
				icon: 'none',
				title: '请先连接蓝牙',
			});
		}
	}
}

/**
 * 断开连接，关闭蓝牙适配器
 */
function disconnect() {
	// 停止搜寻附近的蓝牙外围设备
	uni.stopBluetoothDevicesDiscovery({
		success: function(res) {
			console.log(res)
		}
	})
	// 断开与低功耗蓝牙设备的连接
	uni.closeBLEConnection({
		deviceId: connId,
		success: function(res) {
			connId = ""
		},
	})
}

/**
 * 添加到已保存的打印机列表
 * @param {Object} device	连接成功的对象
 */
function addPrinterList(device) {}

/**
 * 获取已保存打印机列表
 */
function getPrinterList() {}

/**
 * 删除一个已保存的打印机列表
 * @param {Object} device	连接成功的对象
 */
function delPrinter(device) {}

// ---------------------------------------  第一种普遍的打印机 可使用 -----------------------------

/*
 * 写入数据
 */
function printWriteBLE(order) {
	
	let deviceId = currDev.deviceId;
	let serviceId = currDev.services[0].serviceId;
	let characteristicId = currDev.services[0].characteristicId;
	
	wx.showLoading({
		title: '数据传输中',
	})
	
	// 订单录入日期
	if(!order.registerDate || order.registerDate == '') {
		order.registerDate == ''
	}
	// 二段码
	if(!order.twoCode || order.twoCode == '') {
		order.twoCode == ''
	}
	// 三段码 
	if(!order.threeCode || order.threeCode == '') {
		order.threeCode == ''
	}
	// 四段码
	if(!order.fourCode || order.fourCode == '') {
		order.fourCode == ''
	}
	// 运单号
	if(!order.billCode || order.billCode == '') {
		order.billCode == ''
	}
	
	// 集 destinationCenter
	if(!order.destinationCenter || order.destinationCenter == '') {
		order.destinationCenter == ''
	}
	// 收：收件人
	if(!order.acceptMan || order.acceptMan == '') {
		order.acceptMan == ''
	}
	// 收件电话
	if(!order.acceptManMobile || order.acceptManMobile == '') {
		order.acceptManMobile == ''
	}
	// 寄： 寄件人
	if(!order.sendMan || order.sendMan == '') {
		order.sendMan == ''
	}
	// 寄件电话
	if(!order.sendManMobile || order.sendManMobile == '') {
		order.sendManMobile == ''
	}
	// 物品类型
	if(!order.goodsName || order.goodsName == '') {
		order.goodsName == ''
	}
	// 备注
	if(!order.remark || order.remark == '') {
		order.remark == ''
	}
	// 订单号
	if(!order.orderBill || order.orderBill == '') {
		order.orderBill == ''
	}
	
	// 集上方的收件地址--省
	if(!order.acceptProvince || order.acceptProvince == '') {
		order.acceptProvince == ''
	}
	// 收件市级
	if(!order.acceptCity || order.acceptCity == '') {
		order.acceptCity == ''
	}
	// 收件区级
	if(!order.acceptCounty || order.acceptCounty == '') {
		order.acceptCounty == ''
	}
	// 收件街道级
	if(!order.acceptTown || order.acceptTown == '') {
		order.acceptTown == ''
	}
	
	console.log('----要打印的订单列表----', order);
	
	// return
	
	let distribution = "河南省商丘市睢阳区"
	let reciptName = "达女士";
	let reciptPhone = "15888888888";
	let reciptAre = "河南省商丘市睢阳区汇城国际"
	let reciptAdress = "B座147号"
	let mailName = "通先生";
	let mailPhone = "15999999999";
	let itemName = "文件";
	let remark = "客户备注信息"
	
	
	let printUtil = new PrintUtil(1040, 1);
	//最外框
	printUtil.printBox(5, 100, 550, 850);
	printUtil.printlnText(4, 490, 5, "快递");
	printUtil.printlnText(4, 490, 38, "包裹");
	//订单创建时间
	printUtil.printlnText(11, 10, 60, order.registerDate);
	printUtil.setFontWidthAndHeight(1, 1);			//加粗字体
	printUtil.printlnText(1, 10, 115, order.twoCode);	// 二段码
	printUtil.printlnText(1, 110, 115, order.threeCode);	// 三段码
	printUtil.printlnText(1, 240, 115, order.fourCode);	// 四段码
	printUtil.setFontWidthAndHeight(1, 1);			//关闭加粗
	//打印横向条码和文字
	printUtil.printSweepCodeAndText(50, 205, 58, order.orderBill);
	//页码
	// printUtil.printlnText(55, 230, 70, "第1/1页");
	//第一行第三个到底
	// printUtil.printBox(430, 100, 550, 700);
	//第二行
	// printUtil.printBox(10, 200, 430, 300);
	//第三行
	// printUtil.printBox(10, 300, 430, 370);
	//第四行
	// printUtil.printBox(10, 370, 430, 490);
	
	
	//纵向打印条码和文字
	printUtil.printSweepCodeAndTextVertical(450, 680, 85, order.billCode);
	//集散地
	printUtil.printlnText(4, 30, 310, "集");
	printUtil.printlnText(4, 80, 310, distribution);
	//收件地址
	printUtil.printlnText(4, 30, 410, "收");
	printUtil.printlnText(8, 80, 380, reciptName);
	printUtil.printlnText(8, 200, 380, reciptPhone);
	printUtil.printlnText(8, 80, 410, reciptAre);
	printUtil.printlnText(8, 80, 440, reciptAdress);
	//寄件地址
	printUtil.printlnText(8, 30, 520, "寄");
	printUtil.printlnText(8, 80, 520, mailName);
	printUtil.printlnText(8, 200, 520, mailPhone);
	printUtil.printlnText(8, 80, 550, reciptAre);
	// printUtil.printlnText(8, 80, 580, reciptAdress);
	//签字栏
	// printUtil.printlnText(55, 160, 670, "签字栏");
	//二维码
	// printUtil.printQRCode(235, 497, 9, code);
	//文件名称
	// printUtil.setFontWidthAndHeight(2, 2);
	// printUtil.printlnText(8, 10, 720, itemName);
	// printUtil.setFontWidthAndHeight(1, 1);
	//备注
	printUtil.printlnText(8, 10, 780, remark);
	//已验视
	printUtil.printlnText(55, 480, 800, "已验视");
	
	// 分包
	let buffer = printUtil.getData();
	const maxChunk = 20;
	const delay = 20;
	for (let c = 0; c < buffer.length; c++) {
		for (let i = 0, j = 0, length = buffer[c].byteLength; i < length; i += maxChunk, j++) {
			let subPackage = buffer[c].slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
			console.log(subPackage);
			_writeBLECharacteristicValue(subPackage, deviceId, serviceId, characteristicId)
		}
	}
	/**
	 * 	微信小程序打印数据会限制大小，因要解析分包内容
	 */
	setTimeout(() => {
		wx.hideLoading();
	}, 3500);
}

/**
 * 设置数据到打印模版面单上
 * @param {Object} buffer
 */
function _writeBLECharacteristicValue(buffer, deviceId, serviceId, characteristicId) {
	wx.writeBLECharacteristicValue({
		deviceId,
		serviceId,
		characteristicId,
		value: buffer,
		success(res) {
			console.log('writeBLECharacteristicValue success', res)
		},
		fail(res) {
			console.log('writeBLECharacteristicValue fail', res)
		},
	})
}


// ---------------------------------------  第二种厂家指定的打印机 可使用 也要使用厂家给的CPCL文档开发 -----------------------------

/**
 * 发送打印指令
 * 		@param {Object} buffer	数据
 * 		打印指令，详细手册参考CPCL指令集 -- 操作时乱码
 */
function sendCmd(byteStr) {
	let self=this;
	
	console.log('----打印信息值----', currDev);
	
	let deviceId = connectDevice.deviceId;
	let serviceId = connectDevice.serviceId;
	let characteristicId = connectDevice.CharacteristicId;
	
	
	uni.showLoading({ title: '数据传输中' })
	
	try {
		// sendData64 = cutCommand(byteStr)
		var dataArr = subPackage(BleUtil.str2ab(byteStr));
		dataArr.forEach(function (item, index) {
			writeBLEValue(item, deviceId, serviceId, characteristicId);
		})
		
	} catch (e) {
		console.log(e)
		if(fail) fail('打印失败，请检查蓝牙是否正常连接！')
	} finally {
		setTimeout(() => {
			uni.hideLoading()
		}, 3000);
	}
}


/**
 * 分包写入
 */
function cutCommand(byteStr) {
	
	// console.log('byteStr', byteStr);
	sendData64 = [];
	// 新的分包方式
	let buffer = uni.base64ToArrayBuffer(gbToBase64(byteStr));
	// let buffer = uni.base64ToArrayBuffer(ToBase64(byteStr));
	const maxChunk = 20;
	for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
		let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
		sendData64[j] = subPackage
	}
	
	return sendData64;
}

/**
 * 写入数据
 */
function writeBLEValue(arrayBuffer, deviceId, serviceId, characteristicId) {
	uni.writeBLECharacteristicValue({
		deviceId,
		serviceId,
		characteristicId,
		value: arrayBuffer,
		success: function(res) {
			console.log('写入成功',res);
		},
		fail:function(res) {
			console.log(res);
		}
	})
}

/**
 * 分包 大于20长度需要分包
 * 
 */
function subPackage(arrBuffer) {
	var valueArr = [];
	if (arrBuffer.byteLength <= 20) {
		valueArr.push(arrBuffer);
	} else {
		var index = 0;
		do {
			var length = arrBuffer.byteLength - index > 20 ? 20 : arrBuffer.byteLength - index;
			var newAb = new ArrayBuffer(length);
			newAb = arrBuffer.slice(index, index + length);
			valueArr.push(newAb);
			index += length;
		} while (index < arrBuffer.byteLength);
	}
	console.log(valueArr);
	return valueArr;
}

/**
 * @param {Object} delay
 */
function sleep(delay) {
	var start = (new Date()).getTime();
	while ((new Date()).getTime() - start < delay) {
		continue;
	}
}

module.exports = {
	searchBle: searchBle,
	connect: connect,
	getConnectState: getConnectState,
	disconnect: disconnect,
	sendCmd: sendCmd,					// 通过cpcl指令
	printWriteBLE: printWriteBLE,
	stopFindBule:stopFindBule
}