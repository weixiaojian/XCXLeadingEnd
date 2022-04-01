(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/invinbg-image-cropper/invinbg-image-cropper"],{"136f":function(t,i,e){"use strict";(function(t){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var e={name:"image-cropper",props:{cropWidth:{type:Number,default:200},show:{type:Boolean,default:!1},cropHeight:{type:Number,default:200},cropFixed:{type:Boolean,default:!1},src:{type:String},showResetBtn:{type:Boolean,default:!0},showRotateBtn:{type:Boolean,default:!0}},data:function(){var i=t.getSystemInfoSync(),e=i.pixelRatio;return{scale:1,rotate:0,cropW:0,cropH:0,cropOldW:0,cropOldH:0,sysInfo:i,pixelRatio:e,imageRealWidth:0,imageRealHeight:0,cropOffsertX:0,cropOffsertY:0,startX:0,startY:0,border:5,x:0,y:0,startL:0,oldScale:1}},watch:{src:function(t){t.length>0&&this.init()}},computed:{containerTop:function(){var t=0;return t},containerHeight:function(){return this.windowHeight-48},windowWidth:function(){return this.sysInfo.windowWidth},windowHeight:function(){return this.sysInfo.windowHeight},imageRatio:function(){return this.imageRealHeight>0?this.imageRealWidth/this.imageRealHeight:0},imageWidth:function(){return this.imageRatio>=1?this.windowWidth:this.windowWidth*this.imageRatio},imageHeight:function(){return this.imageRatio>=1?this.windowWidth/this.imageRatio:this.windowWidth}},methods:{rotateHandler:function(){3==this.rotate?this.rotate=0:++this.rotate},init:function(){this.rotate=0,this.scale=1,this.cropW=this.cropWidth,this.cropH=this.cropHeight,t.showLoading({title:"图片加载中..."}),this.loadImage(this.src).then((function(i){t.hideLoading()})).catch((function(i){t.hideLoading(),t.showModal({title:"标题",content:"图片加载失败"})}))},loadImage:function(i){var e=this;return new Promise((function(o,r){t.getImageInfo({src:i,success:function(t){e.imageRealWidth=t.width,e.imageRealHeight=t.height,e.cropOffsertX=e.windowWidth/2-e.cropW/2,e.cropOffsertY=e.windowHeight/2-e.cropH/2,e.$nextTick((function(){e.x=e.windowWidth/2-e.imageWidth/2,e.y=e.containerHeight/2-e.imageHeight/2})),o(t)},fail:function(t){r(t)}})}))},cancel:function(){this.$emit("cancel")},confirm:function(i){var e=this;t.showLoading({title:"裁剪中..."});var o=this,r=t.createCanvasContext("myCanvas",o),s=o.pixelRatio,a=o.src,h=o.imageWidth*o.scale,c=o.imageHeight*o.scale,n=o.rotate,d=o.cropOffsertX-o.x-(o.imageWidth-h)/2,p=o.cropOffsertY-o.y-(o.imageHeight-c)/2;switch(r.setFillStyle("white"),r.fillRect(0,0,h,c),r.save(),r.rotate(90*n*Math.PI/180),n){case 1:d+=(c-h)/2,p-=(c-h)/2,r.drawImage(a,-p,d,h,-c);break;case 2:r.drawImage(a,d,p,-h,-c);break;case 3:d+=(c-h)/2,p-=(c-h)/2,r.drawImage(a,p,-d,-h,c);break;default:r.drawImage(a,-d,-p,h,c);break}r.restore(),r.draw(!1,(function(){t.canvasToTempFilePath({canvasId:"myCanvas",destWidth:o.cropW*s,destHeight:o.cropH*s,success:function(r){t.hideLoading(),console.log("this.src",e.src),i.detail.tempFilePath=r.tempFilePath,o.$emit("confirm",i)},fail:function(i){t.hideLoading(),t.showModal({title:"提示",content:"裁剪失败"})}},o)}))},imgTouchStart:function(i){if(2==i.touches.length){this.oldScale=this.scale,this.scaling=!0;var e=i.touches[0].pageX-i.touches[1].pageX,o=i.touches[0].pageY-i.touches[1].pageY,r=Math.sqrt(Math.pow(e,2)+Math.pow(o,2));this.startL=Math.max(e,o,r),t.showModal({content:this.startL})}else this.startX=i.touches[0].pageX-this.x,this.startY=i.touches[0].pageY-this.y},imgMoveing:function(t){if(this.scaling){var i=this.oldScale,e=t.touches[0].pageX-t.touches[1].pageX,o=t.touches[0].pageY-t.touches[1].pageY,r=Math.sqrt(Math.pow(e,2)+Math.pow(o,2)),s=Math.max(e,o,r),a=s-this.startL,h=1;h=h/this.imageWidth>h/this.imageHeight?h/this.imageHeight:h/this.imageWidth,h=h>.1?.1:h;var c=h*a;a>0?i+=Math.abs(c):a<0&&i>Math.abs(c)&&(i-=Math.abs(c)),this.scale=i}else{var n=t.touches[0].pageX-this.startX,d=t.touches[0].pageY-this.startY;this.x=n,this.y=d}},imgMoveEnd:function(){var t=this;setTimeout((function(){t.scaling=!1}),100)},touchStart:function(t){this.startX=t.touches[0].pageX-this.cropOffsertX,this.startY=t.touches[0].pageY-this.cropOffsertY,this.cropOldW=this.cropW,this.cropOldH=this.cropH},cropMoveing:function(t){var i=this._cropX(t.touches[0].pageX-this.startX),e=this._cropY(t.touches[0].pageY-this.startY);this.cropOffsertX=i,this.cropOffsertY=e},dragMove:function(t,i){if(this.cropFixed)return!1;var e=t.touches[0].pageX-this.startX,o=t.touches[0].pageY-this.startY;switch(i){case"left-top":this._cropMoveLeft(e),this._cropMoveTop(o);break;case"middle-top":this._cropMoveTop(o);break;case"right-top":this._cropMoveTop(o),this._cropMoveRight(e);break;case"middle-right":this._cropMoveRight(e);break;case"right-bottom":this._cropMoveRight(e),this._cropMoveBottom(o);break;case"middle-bottom":this._cropMoveBottom(o);break;case"left-bottom":this._cropMoveBottom(o),this._cropMoveLeft(e);break;case"middle-left":this._cropMoveLeft(e);break;default:break}},_cropMoveTop:function(t){var i=this._cropY(t);this.cropH+=this.cropOffsertY-i,this.cropOffsertY=i},_cropMoveRight:function(t){if(this.cropOldW+t>=this.windowWidth-this.border)return!1;this.cropW=this.cropOldW+(t-this.cropOffsertX)},_cropMoveBottom:function(t){if(this.cropOldH+t>=this.windowHeight-this.containerTop-this.border)return!1;this.cropH=this.cropOldH+(t-this.cropOffsertY)},_cropMoveLeft:function(t){var i=this._cropY(t);this.cropW+=this.cropOffsertX-i,this.cropOffsertX=i},_cropX:function(t){return t<=this.border?this.border:t+this.cropW>=this.windowWidth-this.border?this.windowWidth-this.cropW-this.border:t},_cropY:function(t){return t<=this.border?this.border:t+this.cropH>=this.windowHeight-this.containerTop-this.border?this.windowHeight-this.cropH-this.containerTop-this.border:t}}};i.default=e}).call(this,e("543d")["default"])},"23ad":function(t,i,e){},"4dfc":function(t,i,e){"use strict";var o;e.d(i,"b",(function(){return r})),e.d(i,"c",(function(){return s})),e.d(i,"a",(function(){return o}));var r=function(){var t=this,i=t.$createElement;t._self._c},s=[]},"597c":function(t,i,e){"use strict";e.r(i);var o=e("136f"),r=e.n(o);for(var s in o)"default"!==s&&function(t){e.d(i,t,(function(){return o[t]}))}(s);i["default"]=r.a},"9aa4":function(t,i,e){"use strict";var o=e("23ad"),r=e.n(o);r.a},b9d3:function(t,i,e){"use strict";e.r(i);var o=e("4dfc"),r=e("597c");for(var s in r)"default"!==s&&function(t){e.d(i,t,(function(){return r[t]}))}(s);e("9aa4");var a,h=e("f0c5"),c=Object(h["a"])(r["default"],o["b"],o["c"],!1,null,"27ee64d8",null,!1,o["a"],a);i["default"]=c.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/invinbg-image-cropper/invinbg-image-cropper-create-component',
    {
        'components/invinbg-image-cropper/invinbg-image-cropper-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("b9d3"))
        })
    },
    [['components/invinbg-image-cropper/invinbg-image-cropper-create-component']]
]);