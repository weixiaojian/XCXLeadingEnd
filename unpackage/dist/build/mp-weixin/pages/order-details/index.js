(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order-details/index"],{"0199":function(t,e,a){"use strict";a.r(e);var i=a("1c4a"),n=a.n(i);for(var d in i)"default"!==d&&function(t){a.d(e,t,(function(){return i[t]}))}(d);e["default"]=n.a},"0cd7":function(t,e,a){"use strict";var i;a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return d})),a.d(e,"a",(function(){return i}));var n=function(){var t=this,e=t.$createElement;t._self._c},d=[]},"1c4a":function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={data:function(){return{billCode:"",latitude:"",longitude:"",covers:[],hasBill:!0,detailsData:{},pageId:"",type:"",orderCode:"",trackData:[],mapOn:!1,scales:4,isSelf:!1,sendCity:"",recCity:"",billStatus:""}},onLoad:function(t){var e=JSON.parse(t.data);this.type=e.type,this.detailsData=e.item,console.log(e.item),e.item&&(1==e.isclick&&(this.isSelf=!0),this.mapOn=!0),e.billCode?(this.billCode=e.billCode,this.getTrackVOList(e.billCode)):(console.log(e.item.orderBill),this.hasBill=!0,this.getTrackVOList(e.item.orderBill))},computed:{},onShow:function(){},methods:{goelEctronStub:function(){var e={type:this.type,billCode:this.billCode,item:this.detailsData};t.navigateTo({url:"/pages/electron-stub/index?pageId=ddxq&data="+JSON.stringify(e)})},copy:function(e){t.setClipboardData({data:e,success:function(){console.log("success")}})},getTrackVOList:function(e){var a=this,i=this,n={billCode:e};i.$api.getMapPath(n).then((function(e){console.log(e),200==e.code?(e.data.list.length>0&&(i.hasBill=!1,i.trackData=e.data.list),e.data.send&&(i.latitude=(parseInt(e.data.send.latitude)+parseInt(e.data.rec.latitude))/2,i.longitude=(parseInt(e.data.send.longitude)+parseInt(e.data.rec.longitude))/2),e.data.billStatus&&(a.billStatus=e.data.billStatus),e.data.sendCity?(a.sendCity=e.data.sendCity,a.recCity=e.data.recCity):t.showToast({title:"运单号查询有误~",icon:"none",duration:1500}),e.data.order?(i.detailsData=e.data.order,i.isSelf=!0):(i.detailsData={},i.isSelf=!1),i.mapOn=!0,i.covers=[{id:0,content:"",latitude:e.data.send.latitude,longitude:e.data.send.longitude,iconPath:"../../static/img/marker_red.png",width:20,height:20},{id:0,content:"",latitude:e.data.rec.latitude,longitude:e.data.rec.longitude,iconPath:"../../static/img/marker_red.png",width:20,height:20}]):400==e.code&&(t.showToast({title:e.message,icon:"none",duration:4e3}),a.hasBill=!0)}))}}};e.default=a}).call(this,a("543d")["default"])},"38ec":function(t,e,a){},"486c":function(t,e,a){"use strict";a.r(e);var i=a("0cd7"),n=a("0199");for(var d in n)"default"!==d&&function(t){a.d(e,t,(function(){return n[t]}))}(d);a("c9f9");var l,o=a("f0c5"),s=Object(o["a"])(n["default"],i["b"],i["c"],!1,null,"77c9bfc8",null,!1,i["a"],l);e["default"]=s.exports},c9f9:function(t,e,a){"use strict";var i=a("38ec"),n=a.n(i);n.a},d8c1:function(t,e,a){"use strict";(function(t){a("5e56");i(a("66fd"));var e=i(a("486c"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,a("543d")["createPage"])}},[["d8c1","common/runtime","common/vendor"]]]);