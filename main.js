import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false
//全局样式 style + 样式初始化
//全局数据状态管理 vuex
import store from '@/store/index.js';
Vue.prototype.$store = store;

 //自定义提示框全局引用 
 import Toast from '@/components/yd-toast/yd-toast.vue'
 // import toast from '@/common/allMethods/toast.js'
 Vue.use(Toast);

// uni.showToast = toast

// #ifdef H5
import wx from '@/common/allMethods/jweixin.js';
Vue.prototype.$wx = wx;
// #endif	
/*正则校验*/
import Reg from "@/common/allMethods/reg.js"; 
Vue.prototype.$Reg = Reg;
//全局公用过滤器
import '@/filter.js';
//全局公用方法
// import '@/common/allMethods/v-update.js';
import momm from '@/common/allMethods/momm.js';
Vue.prototype.$momm = momm;

 
import Header from '@/components/header/index.vue';   //头部
import ScrollviewTemplate from "@/components/scroll-view-template/index.vue";   //统计数量
import ButtonBox from "@/components/button/index.vue";   //按钮
import HomeList from "@/components/home-list/index.vue";  //首页列表
import NavDate from "@/components/nav-date/index.vue";  //导航日历
import InputSearch from "@/components/search/search.vue";  //搜索框
import TabLists from "@/components/tab-lists/tab-lists.vue";  //tab切换
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";  //下拉刷新上拉加载
import DropDown from "@/components/drop-down/drop-down.vue";  //下拉刷新
import RadioCheck from "@/components/radio/index.vue";  //单选框按钮
import Loading from '@/components/loading/loading.vue'
Vue.component('Loading', Loading);
Vue.component('DropDown', DropDown);
Vue.component('mescroll-uni', MescrollUni);
Vue.component('TabLists',TabLists);
Vue.component('InputSearch',InputSearch);
Vue.component("NavDate",NavDate);  
Vue.component("HomeList",HomeList);  
Vue.component('ButtonBox',ButtonBox);   //按钮
Vue.component('Header',Header);   //公用app头部
Vue.component("RadioCheck",RadioCheck);  // 单选框
Vue.component("ScrollviewTemplate",ScrollviewTemplate); //区域滚动
import '@/common/allMethods/login.js';  //登陆公用方法 (小程序 h5 app)
import '@/common/allMethods/index.js';  //统一全局方法 (小程序 h5 app)
import '@/common/allMethods/audio.js';  //统一音频方法 (小程序 h5 app)
//全局公用静态数据
import Mock from '@/common/mock/index.js';
Vue.prototype.$Mock = Mock;
//全局公用api请求接口(有可能多个ip同用)
import api from '@/common/api/index.js';
Vue.prototype.$api = api;

App.mpType = 'app';
const app = new Vue({
	store,
    ...App
})
app.$mount()
