(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/myaddress/components/address-list"],{"28eb":function(t,e,n){"use strict";n.r(e);var a=n("ff1d"),r=n.n(a);for(var d in a)"default"!==d&&function(t){n.d(e,t,(function(){return a[t]}))}(d);e["default"]=r.a},"8d0a":function(t,e,n){"use strict";var a;n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return d})),n.d(e,"a",(function(){return a}));var r=function(){var t=this,e=t.$createElement;t._self._c},d=[]},a00f:function(t,e,n){"use strict";n.r(e);var a=n("8d0a"),r=n("28eb");for(var d in r)"default"!==d&&function(t){n.d(e,t,(function(){return r[t]}))}(d);n("a6c2");var i,u=n("f0c5"),s=Object(u["a"])(r["default"],a["b"],a["c"],!1,null,"99e74dc4",null,!1,a["a"],i);e["default"]=s.exports},a6c2:function(t,e,n){"use strict";var a=n("bb7c"),r=n.n(a);r.a},bb7c:function(t,e,n){},ff1d:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"address-list",props:{addressData:{type:Array,default:function(){return[]}},defaultAddress:{type:Boolean,default:function(){return!1}}},data:function(){return{}},onLoad:function(t){},methods:{editDefault:function(t,e){var n={index:t,item:e};this.$emit("editDefault",n)},editor_address:function(t,e){var n={type:t,item:e};this.$emit("editor_address",n)},delte_address:function(t,e){var n={index:t,item:e};this.$emit("delte_address",n)},selectAddress:function(t,e){var n={index:t,item:e};this.$emit("selectAddress",n)}}};e.default=a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/myaddress/components/address-list-create-component',
    {
        'pages/myaddress/components/address-list-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("a00f"))
        })
    },
    [['pages/myaddress/components/address-list-create-component']]
]);
