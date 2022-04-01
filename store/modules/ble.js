import {GET_BLE_DATA,GET_BLE_DATA_PRINT,GET_CONNECT_DEVICEId,GET_BLE_DATA_PRINT_LIST} from '@/store/gettersType.js';
import {SET_BLE_DATA, SET_BLE_DATA_PRINT,SET_CONNECT_DEVICEId,SET_BLE_DATA_PRINT_LIST} from '@/store/actionsType.js';

const state = {
	// 当前连接的蓝牙设备
	bleDate: {
		name: '请先连接蓝牙',
		deviceId: "",
	},
	// 存储已连接打印机蓝牙,存入缓存
	bleDatePrint: {},
	// 状态deviceId
	connectDeviceId: "",
	printList:[]
}

const mutations = {
	[SET_BLE_DATA](state,value){
		state.bleDate = value
	},
	[SET_BLE_DATA_PRINT](state,value){
		state.bleDatePrint = value;
	},
	[SET_CONNECT_DEVICEId](state,value){
		state.connectDeviceId = value;
	},
	[SET_BLE_DATA_PRINT_LIST](state,value){
		state.printList = value;
	}
}

const actions = {
	[SET_BLE_DATA]({commit},value){
		commit(SET_BLE_DATA,value);
	},
	[SET_BLE_DATA_PRINT]({commit},value){
		commit(SET_BLE_DATA_PRINT,value);
	},
	[SET_CONNECT_DEVICEId]({commit},value){
		commit(SET_CONNECT_DEVICEId,value);
	},
	[SET_BLE_DATA_PRINT_LIST]({commit},value){
		commit(SET_BLE_DATA_PRINT_LIST,value);
	}
}

const getters = {
	[GET_BLE_DATA]:(state)=>{
		return state.bleDate;
	},
	[GET_BLE_DATA_PRINT]:(state)=>{
		return state.bleDatePrint
	},
	[GET_CONNECT_DEVICEId]:(state)=>{
		return state.connectDeviceId
	},
	[GET_BLE_DATA_PRINT_LIST]:(state)=>{
		return state.printList
	}
}

export default{
	state,
	getters,
	actions,
	mutations
};