import Vue from 'vue';

/**
 * 音频播放
 */
let url=null;
const playAudio = function(url){
	var innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	innerAudioContext.src = url;
	innerAudioContext.onPlay(() => {
	  console.log('开始播放');
	  setTimeout(()=>{
	  		innerAudioContext.destroy();
	  		console.log("销毁");
	  },500);
	});
	innerAudioContext.onError((res) => {
		console.log(res);
	});	
}

Vue.prototype.$audioList = {
	"scanok":function(){
		url = "static/audio/scanok.wav";
		playAudio(url);
	},
	"error":function(){
		url = "static/audio/error.wav";
		playAudio(url);
	},
	"neworder":function(){
		url = "static/audio/neworder.wav";
		playAudio(url);
	},
	"getorder":function(){
		url = "static/audio/getorder.wav";
		playAudio(url);
	},
	"scanrequired":function(){
		url = "static/audio/scanrequired.wav";
		playAudio(url);
	}
}

