(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/myPrinter/myPrinter"],{"0bc4":function(e,t,n){"use strict";n.r(t);var o=n("2154"),c=n("4139");for(var a in c)"default"!==a&&function(e){n.d(t,e,(function(){return c[e]}))}(a);n("34c2");var r,i=n("f0c5"),d=Object(i["a"])(c["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],r);t["default"]=d.exports},2154:function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return o}));var o={animationAuthModal:function(){return n.e("components/animation-auth-modal/animation-auth-modal").then(n.bind(null,"43e5"))}},c=function(){var e=this,t=e.$createElement,n=(e._self._c,e.__map(e.searchList,(function(t,n){var o=e.__get_orig(t),c=t.name?e._f("filterBleMP")(t.deviceId):null;return{$orig:o,f0:c}})));e.$mp.data=Object.assign({},{$root:{l0:n}})},a=[]},3244:function(e,t,n){"use strict";(function(e){n("5e56");o(n("66fd"));var t=o(n("0bc4"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},"34c2":function(e,t,n){"use strict";var o=n("6fe1"),c=n.n(o);c.a},4139:function(e,t,n){"use strict";n.r(t);var o=n("99eb"),c=n.n(o);for(var a in o)"default"!==a&&function(e){n.d(t,e,(function(){return o[e]}))}(a);t["default"]=c.a},"6fe1":function(e,t,n){},"99eb":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=u(n("f1fd")),c=u(n("79f4")),a=u(n("1239")),r=n("8a96"),i=n("1d5b"),d=n("2f62");function u(e){return e&&e.__esModule?e:{default:e}}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){f(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function f(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var _={data:function(){return{searchList:[],order_data:[{orderBill:"100009319371",billcode:"29349234982349",registerDate:"2021-5-18",twoCode:"102",threeCode:"T052",fourCode:"01",destinationCenter:"",sendProvince:"广东省",sendCity:"深圳市",sendCounty:"宝安区",sendTown:"新安街道",sendManAddress:"中粮大厦商务公园",sendMan:"张三寄件人",sendManMobile:"131000000000",sendManCompany:"深圳智腾达有限公司",acceptProvince:"广东省",acceptCity:"深圳市",acceptCounty:"西乡区",acceptTown:"测试街道",acceptManAddress:"测试详细地址",acceptMan:"李四收件人",acceptManMobile:"181000100001",acceptManCompany:"测试公司",goodsName:"食品",remark:"韵达同城配相信你的之快"}],pageId:"",blePrint:[],preData:{}}},computed:l({},(0,d.mapGetters)([r.GET_BLE_DATA,r.GET_BLE_DATA_PRINT,r.GET_CONNECT_DEVICEId,r.GET_BLE_DATA_PRINT_LIST])),onLoad:function(e){if(console.log(e.pageId),this.pageId=e.pageId,"ddcx"==this.pageId)try{this.preData=JSON.parse(e.data)}catch(t){console.log(t)}console.log("GET_BLE_DATA_PRINT_LIST",this.GET_BLE_DATA_PRINT_LIST)},onShow:function(){var t=this;e.openBluetoothAdapter({success:function(t){console.log(t),e.getBluetoothAdapterState({success:function(e){console.log(e)}})}}),t.blePrint=t.$getStorageSync("blePrint")||[]},methods:l(l({},(0,d.mapActions)([i.SET_BLE_DATA,i.SET_BLE_DATA_PRINT,i.SET_CONNECT_DEVICEId,i.SET_BLE_DATA_PRINT_LIST])),{},{searchBle:function(){var e=this;wx.getSetting({success:function(t){wx.getSystemInfo({success:function(n){t.authSetting["scope.userLocation"]?n.locationEnabled?e.$throttle((function(){e.openSearchBle()}),500):e.$toast("请开启手机GPS权限再搜索设备"):e.$refs.layerModel.openModal()}})}})},closeBle:function(){o.default.disconnect(),this.searchList=[],this.SET_BLE_DATA({name:"请先连接蓝牙",deviceId:""}),this.SET_BLE_DATA_PRINT({}),this.SET_CONNECT_DEVICEId("")},printBle:function(){var e=this;o.default.getConnectState((function(t){if(t.state&&200==t.code)for(var n=0;n<e.order_data.length;n++){var r=(0,a.default)(c.default["韵达同城联"],e.order_data[n]);r.join(""),o.default.sendCmd(r)}}))},openSearchBle:function(){var e=this;e.searchList=[],o.default.searchBle((function(t){e.searchList=t}))},connectTo:function(t){var n=this;n.GET_BLE_DATA.deviceId?n.$toast("当前已连接设备,请先手动断开"):o.default.connect(t,(function(t){if(console.log("item",t),200==t.code){n.SET_CONNECT_DEVICEId(t.device.deviceId),n.SET_BLE_DATA({name:t.device.name,deviceId:t.device.deviceId}),n.SET_BLE_DATA_PRINT({name:t.device.name,deviceId:t.device.deviceId});var o=[];n.GET_BLE_DATA_PRINT_LIST.length>0?n.GET_BLE_DATA_PRINT_LIST.forEach((function(e){e.deviceId!=t.device.deviceId&&(o.push({name:t.device.name,deviceId:t.device.deviceId}),n.blePrint=o,console.log(n.blePrint),n.SET_BLE_DATA_PRINT_LIST(o),n.$setStorageSync("blePrint",o))})):(o.push({name:t.device.name,deviceId:t.device.deviceId}),n.blePrint=o,console.log(n.blePrint),n.SET_BLE_DATA_PRINT_LIST(o),n.$setStorageSync("blePrint",o)),console.log(n.GET_BLE_DATA_PRINT_LIST),"ddcx"==n.pageId&&setTimeout((function(){getApp().globalData.currentIndex=1,e.switchTab({url:"/pages/tabbar/inquire/index"})}),500)}}),(function(e){console.log(e)}))}})};t.default=_}).call(this,n("543d")["default"])}},[["3244","common/runtime","common/vendor"]]]);