import {GET_TOKEN,GET_USERINFO} from '@/store/gettersType.js';
import {SET_TOKEN,SET_USERINFO,SET_CLEAR_STATE} from '@/store/actionsType.js';
/*
*账号用户存储模块
* defaultCurrency	string  货币类型
	deptName	string  部门名称
	employeeCode	string  员工编号
	employeeName	string  员工名称
	mobilePhone	 string  员工手机
	ownerSite	string  所属网点
	siteCode	string  网点编号
	siteName	string  网点名称
	superiorFinanceCenter	string  所属财务中心
	superiorFinanceCenterCode	string  所属财务中心CODE
	superiorSite	string  所属网点
	superiorSiteCode	string  所属网点CODE
	token	string 登入token
	type	string  网点类型
*/
const state = {
	token: '',//用户token
	userInfo: {}   //用户信息
};
const getters = {
	[GET_TOKEN]:(state)=>{
		return state.token
	},
	[GET_USERINFO]:(state)=>{
		return state.userInfo
	}
};


const actions= {
	[SET_TOKEN]({commit},value){
		commit(SET_TOKEN,value);
	},
	[SET_USERINFO]({commit},value){
		commit(SET_USERINFO,value);
	},
	[SET_CLEAR_STATE]({commit},value){
		commit(SET_CLEAR_STATE);
	}
};

const mutations = {
	[SET_TOKEN](state,value){
		state.token = value;
	},
	[SET_USERINFO](state,value){
		state.userInfo = value;
	},
	[SET_CLEAR_STATE](state,value){
		state.token="",//用户token
		state.userInfo={}   //用户信息
	}
}

export default{
	state,
	getters,
	actions,
	mutations
}