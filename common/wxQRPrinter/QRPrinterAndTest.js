/**
 * 	@Author	æ´ç¥å - DaiZuHua
 *  @CreateDate 2021-5-20 ð åæ¨ 1-6ç¹
 *  @Describe ä½åèèç
 *  @Function éç¨äºææèçè®¾å¤è¿æ¥
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

let searchList = []		// å­æ¾æç´¢åºçèçè®¾å¤æ°ç»
let currDev = null		// å­æ¾è¿æ¥æåçè®¾å¤item
let connId				// è¿æ¥æåçè®¾å¤ID
let sendData64 = []		// å·²è½¬æ¢çæå°æ°æ®
let uuid				// ç¹å¾å¼
let UUID_NOTIFY			// notify
let connectDevice
/**
 * 	æå¼èçééå¨å¹¶æç´¢
 * 	@param {Object} searchedPrinters	åè°æ°æç´¢å°çè®¾å¤ï¼æ°ç»ï¼
 * 	æ­¥éª¤ï¼
 * 		1ãå¿è®°æå¼èç
 * 		2ãæ²¡ææå¼å®ä½åè½
 * 		3ãå¾®ä¿¡æ²¡æå®ä½æéï¼å¨ææºçæéè®¾ç½®éæå¼ï¼
 */
function searchBle(searchedPrinters, fail) {
	uni.openBluetoothAdapter({ //åå§åèçæ¨¡å
		success: function(res) {
			//çå¬å¯»æ¾å°æ°è®¾å¤çäºä»¶
			onDevice(searchedPrinters)
			//è·åæ¬æºèçééå¨ç¶æ
			uni.getBluetoothAdapterState({ 
				success: function(res) {
					console.log(res)
					if (res.available) {
						if (res.discovering) {
							stopFindBule()
						}
						//æç´¢èç
						//å¼å§æå¯»éè¿çèçå¤å´è®¾å¤
						console.log("å¼å§æå¯»éè¿çèçå¤å´è®¾å¤")
						uni.startBluetoothDevicesDiscovery({
							success(res) {
								console.log(res)
							}
						})
					} else {
						console.log('æ¬æºèçä¸å¯ç¨')
					}
				},
			})
		},fail: function(err) {
			if (fail) fail(err)
			uni.showToast({
				icon: 'none',
				title: "è¯·æ£æ¥èçæ¯å¦æå¼",
				duration: 3000
			})
		}
	})
}

/**
 * çå¬å¯»æ¾å°æ°è®¾å¤çäºä»¶
 */
function onDevice(searchedPrinters) {
	console.log("çå¬å¯»æ¾å°æ°è®¾å¤çäºä»¶---------------");

	uni.startBluetoothDevicesDiscovery({
		powerLevel: "high",			// å å¿«éåº¦æç´¢
		allowDuplicatesKey: true,
		success: function(res) {
			uni.showLoading({
				title: 'æ­£å¨æç´¢ä¸­'
			});
			
			//çå¬å¯»æ¾å°æ°è®¾å¤çäºä»¶
			uni.onBluetoothDeviceFound(function(devices) {
				
				console.log('-------new----------' + JSON.stringify(devices))
				
				var re = JSON.parse(JSON.stringify(devices))
				
				console.log(re.devices[0].name + "  " + re.devices[0].deviceId)
				
				let name = re.devices[0].localName
				// å¤æ­æç´¢åºçèçåç§°
				if (name != "") {
					
					// åç°å¹¶æ·»å æ°çè®¾ç½®
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
					// åè°æç´¢åºçèçä¿¡æ¯
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
 *  åæ­¢æå¯»éè¿çèçå¤å´è®¾å¤
 */
function stopFindBule() {
	uni.stopBluetoothDevicesDiscovery({
		success(res) {
			console.log(res)
		}
	})
}

/**
 * è¿æ¥èç
 * @param {Object} item		è¿æ¥çèçå¯¹è±¡
 * @param {Object} success	æåçåè°
 * @param {Object} fail		å¤±è´¥çåè°
 */
function connect(item, success, fail) {
	console.log("è¿æ¥èç---------------" + item.deviceId)
	
	let deviceId = item.deviceId
	uni.createBLEConnection({//è¿æ¥ä½åèèçè®¾å¤
		deviceId: deviceId,
		complete:function(res) {
			console.log(res)
			if (res.errMsg == "createBLEConnection:ok") {
				
				uni.showToast({
					icon:'none', 
					title: "è¿æ¥èç-" + item.name + "-æå"
				})
				// è¿æ¥çè®¾å¤ID
				connId = deviceId;
				// è¿æ¥çèçå¯¹è±¡
				currDev = item;
				console.log('è¿æ¥currDev--'+currDev)
				setTimeout(function() {
					getBLEServices(deviceId, success, fail)//è·åèçè®¾å¤æææå¡(service)
				}, 2000)
			} else {
				console.log(res)
			}
		},
	})
}

/**
 * è·åèçè®¾å¤æææå¡(service) -- ä¸»æå¡ID
 * @param {Object} _deviceId	è¿æ¥è®¾å¤ID
 * @param {Object} success		æååè°
 * @param {Object} fail			å¤±è´¥åè°
 */
function getBLEServices(_deviceId, success, fail) {
	let deviceId = _deviceId
	console.log("è·åèçè®¾å¤æææå¡(service)")
	
	uni.getBLEDeviceServices({
		// è¿éç deviceId éè¦å·²ç»éè¿ createBLEConnection ä¸å¯¹åºè®¾å¤å»ºç«é¾æ¥
		deviceId: deviceId,
		complete: function(res) {
			
			console.log(res)
			let serviceId = ""
			
			for (let s = 0; s < res.services.length; s++) {
				
				console.log(res.services[s].uuid)
				// è·åå°çæå¡ID
				let serviceId = res.services[s].uuid
				
				// è·åèçè®¾å¤æä¸ªæå¡ä¸­ææç¹å¾å¼(characteristic)
				uni.getBLEDeviceCharacteristics({
					// è¿éç deviceId éè¦å·²ç»éè¿ createBLEConnection ä¸å¯¹åºè®¾å¤å»ºç«é¾æ¥
					deviceId: deviceId,
					// è¿éç serviceId éè¦å¨ getBLEDeviceServices æ¥å£ä¸­è·å
					serviceId: serviceId,
					success:function(res){
						console.log('ç¹å¾');
						let re = JSON.parse(JSON.stringify(res))
						console.log('deviceId = [' + deviceId + ']  serviceId = [' + serviceId + ']')
						
						for (let c = 0; c < re.characteristics.length; c++) {
							// åçæä½
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
							// notifyæä½
							if(re.characteristics[c].properties.notify == true) {
								UUID_NOTIFY = re.characteristics[c].uuid
							}
						}
						// å¤æ­è®¾å¤IDãæååè°ãè·åçåçç¹å¾å¼å­å¨ -- è·åç¹å¾æåæè®¾ç½®è¿æ¥ä¸
						if(serviceId && success && uuid && UUID_NOTIFY) {
							// å¼å¯notify
							enableNotify(deviceId, serviceId, uuid, success);
						} else {
							if (fail) fail({ "msg": "å¤±è´¥" })
						}
					}
				})
				// çå¬å½åèçè¿æ¥ç¶æ
				getBLEConnStateChange();
			}
		},
		fail: function(res) {
			console.log(res);
		}
	})
}


/**
 * 	åæä½æ¨¡å -- å¼å¯ååéç¥
 *  @param {Object} deviceId
 *  @param {Object} serviceId
 */
function enableNotify(deviceId, serviceId, uuid, success) {
	
	console.log('å¯ç¨notify' + deviceId + " / service:" + serviceId + " / char : " + UUID_NOTIFY);
	
	uni.notifyBLECharacteristicValueChange({
		deviceId,
		serviceId,
		characteristicId: UUID_NOTIFY,
		state: true,	// å¼å¯
		success: function (res) {
			console.log('å¯ç¨notifyæå');
			
			listenReceive();
			
			uni.showToast({
				icon: 'none',
				title: 'æå°æºå·²å°±ç»ª'
			})
			 connectDevice = {
				name: currDev.name,
				deviceId,
				serviceId,
				CharacteristicId: uuid
			}
			success({
				msg: "æå",
				device: connectDevice,
				code: 200
			})
			//è¿æ¥æå å³é­æç´¢
			stopFindBule()
		}, fail: function (e) {
			console.log('å¯ç¨notifyå¤±è´¥');
		}
	})
	
}

/**
 * æ°æ®ä¸­å¿æ¶å°æ¶æ¯
 */
function listenReceive() {
	uni.onBLECharacteristicValueChange(function (res){
		console.log('æ°æ®ä¸­å¿æ¶å°æ¶æ¯ï¼' + hexString)
	})
}

/**
 * çå¬å½åèçè¿æ¥ç¶æ
 */
function getBLEConnStateChange() {
	// çå¬ä½åèèçè¿æ¥ç¶æçæ¹åäºä»¶ãåæ¬å¼åèä¸»å¨è¿æ¥ææ­å¼è¿æ¥ï¼è®¾å¤ä¸¢å¤±ï¼è¿æ¥å¼å¸¸æ­å¼ç­ç­
	uni.onBLEConnectionStateChange(function(res) {
		/**
		 * 	æ ¹æ®çå¬å°è®¾å¤IDä¸å·²è¿æ¥è®¾å¤ID--èçæ­å¼
		 * 	deviceId: èçè®¾å¤ID
		 *  connected: æ¯å¦å¤äºå·²è¿æ¥ç¶æ
		 *  connId: å½åè¿æ¥è®¾å¤ID
		 *  searchList: èçæ­å¼æ¸ç©ºæç´¢çæ°ç»å¼
		 * 	storeæ¹æ³ï¼
		 * 		store.dispatch(SET_BLE_DATA): å½åå·²è¿æ¥è®¾å¤
		 * 		store.dispatch(SET_CONNECT_DEVICEId): å½åè¿æ¥çè®¾å¤IDåç¶æ
		 */
		console.log('state==>', res.deviceId, res.connected, connId)

		if (res.deviceId == connId && !res.connected) {
			store.dispatch(SET_BLE_DATA, {
				name: 'è¯·åè¿æ¥èç',
				deviceId: ""
			})
			store.dispatch(SET_CONNECT_DEVICEId, "")
			searchList = [];
			setTimeout(function() {
				uni.showToast({
					icon: 'none',
					title: 'èçå·²æ­å¼'
				});
			}, 1000)
		}
	})
}

/**
 * è·åå·²è¿æ¥èçç¶æ -- è¦åè¿æ¥èçæåï¼connectDeviceIdç¶æææå¼
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
				title: 'è¯·åè¿æ¥èç',
			});
		}
	}
}

/**
 * æ­å¼è¿æ¥ï¼å³é­èçééå¨
 */
function disconnect() {
	// åæ­¢æå¯»éè¿çèçå¤å´è®¾å¤
	uni.stopBluetoothDevicesDiscovery({
		success: function(res) {
			console.log(res)
		}
	})
	// æ­å¼ä¸ä½åèèçè®¾å¤çè¿æ¥
	uni.closeBLEConnection({
		deviceId: connId,
		success: function(res) {
			connId = ""
		},
	})
}

/**
 * æ·»å å°å·²ä¿å­çæå°æºåè¡¨
 * @param {Object} device	è¿æ¥æåçå¯¹è±¡
 */
function addPrinterList(device) {}

/**
 * è·åå·²ä¿å­æå°æºåè¡¨
 */
function getPrinterList() {}

/**
 * å é¤ä¸ä¸ªå·²ä¿å­çæå°æºåè¡¨
 * @param {Object} device	è¿æ¥æåçå¯¹è±¡
 */
function delPrinter(device) {}

// ---------------------------------------  ç¬¬ä¸ç§æ®éçæå°æº å¯ä½¿ç¨ -----------------------------

/*
 * åå¥æ°æ®
 */
function printWriteBLE(order) {
	
	let deviceId = currDev.deviceId;
	let serviceId = currDev.services[0].serviceId;
	let characteristicId = currDev.services[0].characteristicId;
	
	wx.showLoading({
		title: 'æ°æ®ä¼ è¾ä¸­',
	})
	
	// è®¢åå½å¥æ¥æ
	if(!order.registerDate || order.registerDate == '') {
		order.registerDate == ''
	}
	// äºæ®µç 
	if(!order.twoCode || order.twoCode == '') {
		order.twoCode == ''
	}
	// ä¸æ®µç  
	if(!order.threeCode || order.threeCode == '') {
		order.threeCode == ''
	}
	// åæ®µç 
	if(!order.fourCode || order.fourCode == '') {
		order.fourCode == ''
	}
	// è¿åå·
	if(!order.billCode || order.billCode == '') {
		order.billCode == ''
	}
	
	// é destinationCenter
	if(!order.destinationCenter || order.destinationCenter == '') {
		order.destinationCenter == ''
	}
	// æ¶ï¼æ¶ä»¶äºº
	if(!order.acceptMan || order.acceptMan == '') {
		order.acceptMan == ''
	}
	// æ¶ä»¶çµè¯
	if(!order.acceptManMobile || order.acceptManMobile == '') {
		order.acceptManMobile == ''
	}
	// å¯ï¼ å¯ä»¶äºº
	if(!order.sendMan || order.sendMan == '') {
		order.sendMan == ''
	}
	// å¯ä»¶çµè¯
	if(!order.sendManMobile || order.sendManMobile == '') {
		order.sendManMobile == ''
	}
	// ç©åç±»å
	if(!order.goodsName || order.goodsName == '') {
		order.goodsName == ''
	}
	// å¤æ³¨
	if(!order.remark || order.remark == '') {
		order.remark == ''
	}
	// è®¢åå·
	if(!order.orderBill || order.orderBill == '') {
		order.orderBill == ''
	}
	
	// éä¸æ¹çæ¶ä»¶å°å--ç
	if(!order.acceptProvince || order.acceptProvince == '') {
		order.acceptProvince == ''
	}
	// æ¶ä»¶å¸çº§
	if(!order.acceptCity || order.acceptCity == '') {
		order.acceptCity == ''
	}
	// æ¶ä»¶åºçº§
	if(!order.acceptCounty || order.acceptCounty == '') {
		order.acceptCounty == ''
	}
	// æ¶ä»¶è¡éçº§
	if(!order.acceptTown || order.acceptTown == '') {
		order.acceptTown == ''
	}
	
	console.log('----è¦æå°çè®¢ååè¡¨----', order);
	
	// return
	
	let distribution = "æ²³åçåä¸å¸ç¢é³åº"
	let reciptName = "è¾¾å¥³å£«";
	let reciptPhone = "15888888888";
	let reciptAre = "æ²³åçåä¸å¸ç¢é³åºæ±åå½é"
	let reciptAdress = "Båº§147å·"
	let mailName = "éåç";
	let mailPhone = "15999999999";
	let itemName = "æä»¶";
	let remark = "å®¢æ·å¤æ³¨ä¿¡æ¯"
	
	
	let printUtil = new PrintUtil(1040, 1);
	//æå¤æ¡
	printUtil.printBox(5, 100, 550, 850);
	printUtil.printlnText(4, 490, 5, "å¿«é");
	printUtil.printlnText(4, 490, 38, "åè£¹");
	//è®¢ååå»ºæ¶é´
	printUtil.printlnText(11, 10, 60, order.registerDate);
	printUtil.setFontWidthAndHeight(1, 1);			//å ç²å­ä½
	printUtil.printlnText(1, 10, 115, order.twoCode);	// äºæ®µç 
	printUtil.printlnText(1, 110, 115, order.threeCode);	// ä¸æ®µç 
	printUtil.printlnText(1, 240, 115, order.fourCode);	// åæ®µç 
	printUtil.setFontWidthAndHeight(1, 1);			//å³é­å ç²
	//æå°æ¨ªåæ¡ç åæå­
	printUtil.printSweepCodeAndText(50, 205, 58, order.orderBill);
	//é¡µç 
	// printUtil.printlnText(55, 230, 70, "ç¬¬1/1é¡µ");
	//ç¬¬ä¸è¡ç¬¬ä¸ä¸ªå°åº
	// printUtil.printBox(430, 100, 550, 700);
	//ç¬¬äºè¡
	// printUtil.printBox(10, 200, 430, 300);
	//ç¬¬ä¸è¡
	// printUtil.printBox(10, 300, 430, 370);
	//ç¬¬åè¡
	// printUtil.printBox(10, 370, 430, 490);
	
	
	//çºµåæå°æ¡ç åæå­
	printUtil.printSweepCodeAndTextVertical(450, 680, 85, order.billCode);
	//éæ£å°
	printUtil.printlnText(4, 30, 310, "é");
	printUtil.printlnText(4, 80, 310, distribution);
	//æ¶ä»¶å°å
	printUtil.printlnText(4, 30, 410, "æ¶");
	printUtil.printlnText(8, 80, 380, reciptName);
	printUtil.printlnText(8, 200, 380, reciptPhone);
	printUtil.printlnText(8, 80, 410, reciptAre);
	printUtil.printlnText(8, 80, 440, reciptAdress);
	//å¯ä»¶å°å
	printUtil.printlnText(8, 30, 520, "å¯");
	printUtil.printlnText(8, 80, 520, mailName);
	printUtil.printlnText(8, 200, 520, mailPhone);
	printUtil.printlnText(8, 80, 550, reciptAre);
	// printUtil.printlnText(8, 80, 580, reciptAdress);
	//ç­¾å­æ 
	// printUtil.printlnText(55, 160, 670, "ç­¾å­æ ");
	//äºç»´ç 
	// printUtil.printQRCode(235, 497, 9, code);
	//æä»¶åç§°
	// printUtil.setFontWidthAndHeight(2, 2);
	// printUtil.printlnText(8, 10, 720, itemName);
	// printUtil.setFontWidthAndHeight(1, 1);
	//å¤æ³¨
	printUtil.printlnText(8, 10, 780, remark);
	//å·²éªè§
	printUtil.printlnText(55, 480, 800, "å·²éªè§");
	
	// åå
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
	 * 	å¾®ä¿¡å°ç¨åºæå°æ°æ®ä¼éå¶å¤§å°ï¼å è¦è§£æåååå®¹
	 */
	setTimeout(() => {
		wx.hideLoading();
	}, 3500);
}

/**
 * è®¾ç½®æ°æ®å°æå°æ¨¡çé¢åä¸
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


// ---------------------------------------  ç¬¬äºç§åå®¶æå®çæå°æº å¯ä½¿ç¨ ä¹è¦ä½¿ç¨åå®¶ç»çCPCLææ¡£å¼å -----------------------------

/**
 * åéæå°æä»¤
 * 		@param {Object} buffer	æ°æ®
 * 		æå°æä»¤ï¼è¯¦ç»æååèCPCLæä»¤é -- æä½æ¶ä¹±ç 
 */
function sendCmd(byteStr) {
	let self=this;
	
	console.log('----æå°ä¿¡æ¯å¼----', currDev);
	
	let deviceId = connectDevice.deviceId;
	let serviceId = connectDevice.serviceId;
	let characteristicId = connectDevice.CharacteristicId;
	
	
	uni.showLoading({ title: 'æ°æ®ä¼ è¾ä¸­' })
	
	try {
		// sendData64 = cutCommand(byteStr)
		var dataArr = subPackage(BleUtil.str2ab(byteStr));
		dataArr.forEach(function (item, index) {
			writeBLEValue(item, deviceId, serviceId, characteristicId);
		})
		
	} catch (e) {
		console.log(e)
		if(fail) fail('æå°å¤±è´¥ï¼è¯·æ£æ¥èçæ¯å¦æ­£å¸¸è¿æ¥ï¼')
	} finally {
		setTimeout(() => {
			uni.hideLoading()
		}, 3000);
	}
}


/**
 * åååå¥
 */
function cutCommand(byteStr) {
	
	// console.log('byteStr', byteStr);
	sendData64 = [];
	// æ°çååæ¹å¼
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
 * åå¥æ°æ®
 */
function writeBLEValue(arrayBuffer, deviceId, serviceId, characteristicId) {
	uni.writeBLECharacteristicValue({
		deviceId,
		serviceId,
		characteristicId,
		value: arrayBuffer,
		success: function(res) {
			console.log('åå¥æå',res);
		},
		fail:function(res) {
			console.log(res);
		}
	})
}

/**
 * åå å¤§äº20é¿åº¦éè¦åå
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
	sendCmd: sendCmd,					// éè¿cpclæä»¤
	printWriteBLE: printWriteBLE,
	stopFindBule:stopFindBule
}