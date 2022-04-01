<template name="scoll-view-template">
	<!-- 区域滚动 -->
	<scroll-view 
	   :scroll-y="true" 
	   :scroll-x="true" 
	   :show-scrollbar="true" 
	   :enable-flex="true" 
	   class="scroll-view" 
	   :style="[scrollStyle]"
	   @scroll="scrollView"
	>
		<slot></slot>
	</scroll-view>
</template>

<script>
	import {GET_IPHONE_DATA,GET_HEADER_HEIGHT,GET_HOMEINFO_HEIGHT,GET_OPERATIONS,GET_OPERATIONS_BTN,GET_MYINFO_HEIGHT} from '@/store/gettersType.js';
	import {mapGetters} from 'vuex';
	export default {
		name:"scoll-view-template",
		data(){
		   return {
		   }	
		},
		computed:{
			...mapGetters([GET_IPHONE_DATA,GET_HOMEINFO_HEIGHT,GET_HEADER_HEIGHT,GET_OPERATIONS,GET_OPERATIONS_BTN,GET_MYINFO_HEIGHT]),
			scrollStyle(){
				let tabbar = 0;
				//获取当前路由判断
				let pages = getCurrentPages();
				let page = (pages[pages.length - 1]).route;
				console.log(page);				
				console.log(this.GET_IPHONE_DATA.screenHeight)
				// if(page === "pages/mycommission/mycommission"){
				// 	let height = this.GET_IPHONE_DATA ? (this.GET_IPHONE_DATA.screenHeight - this.GET_HEADER_HEIGHT - this.GET_OPERATIONS) + 'px' : 0;
				// 	console.log(height);
				// 	let style = {height};
				// 	return style;
				// }
				if(page === "pages/tabbar/home/index" || 
				   page === "pages/tabbar/receipt/index"
				){
					//tabbar页面高度;
					let height = this.GET_IPHONE_DATA ? (this.GET_IPHONE_DATA.screenHeight - this.GET_HOMEINFO_HEIGHT - this.GET_HEADER_HEIGHT - 50) + 'px' : 0;
					let style = {height};
					return style;
				}else if(page === "pages/tabbar/my/index"){
					let height = this.GET_IPHONE_DATA ? (this.GET_IPHONE_DATA.screenHeight - this.GET_MYINFO_HEIGHT - 50) + 'px' : 0;
					let style = {height};
					return style;
				}
				// else if(page === "pages/mycommission/index"){
				// 	//扫描模块
				// 	let height = this.GET_IPHONE_DATA ? (this.GET_IPHONE_DATA.screenHeight  - this.GET_HEADER_HEIGHT - this.GET_OPERATIONS - this.GET_OPERATIONS_BTN) + 'px' : 0;
				// 	let style = {height};
				// 	return style;
				// }
			}
		},
		methods:{
			scrollView(e){
				this.$emit("scrollView",e);
			}
		}
	}
</script>

<style lang="scss" scoped>
.scroll-view{
	width: 100%;
	// padding:0 20rpx;
	// padding-top:20rpx;
	box-sizing: border-box;
}
</style>
