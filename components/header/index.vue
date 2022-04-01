<template name="page-header">
	<!-- 公用头部 -->
	<view>
		<view class="uni-page-head uni-page-head-header" :class="[isFixed ? 'isFixed' : '']" :style="[{'background':bgColor}]">
			<!-- left -->
			<view class="uni-page-head-left" v-if="isLeft">
				<!-- <u-icon :name="iconName" :color="iconColor" :size="iconSize" ></u-icon> -->
				<slot name="left"> 
					<!-- <span :class="'iconfont ' + iconName" :style="[{'color':iconColor,'fontSize':iconSize + 'rpx'}]" @click="hanldLeft"></span> -->
					<image :src="leftIcon" alt=""  :style="[{'color':iconColor,'fontSize':iconSize + 'rpx','height':'60rpx','width':'60rpx'}]" @click="hanldLeft" ></image>
				</slot>
			</view>
			<!-- title -->
			<view class="uni-page-head-title" :style="[{'color':titleColor,'fontSize':fontSize + 'rpx','textAlign':textAlign}]">
				<slot name="center"> 
					{{title}}
				</slot>
			</view>
		    <!-- #ifndef MP-WEIXIN -->
			<view class="uni-page-head-right" v-if="isRight">
			    <slot name="right">
					<image :src="rightIcon" alt=""  :style="[{'color':iconColor,'fontSize':iconSize + 'rpx','height':'60rpx','width':'60rpx'}]" @click="hanldRight" ></image>
				</slot>
			</view>
		    <!-- #endif -->
 		</view>
		<view class="uni-page-head-header" v-if="isFixed"></view>
	</view>
</template>
<script>
	/**
	 * title 头部标题
	 * bgColor 背景颜色
	 * titleColor 字体颜色
	 */
	export default {
		name: "page-header",
		props: {
			//头部是否固定
			isFixed:{
			   type:Boolean,
			   default:true
			},
			//头部标题
			title: {
				type: String,
				default:""
			},
			//颜色
			bgColor:{
				type:String,
				default:""
			},
			//标题字体颜色
			titleColor:{
				type:String,
				default:"#ffffff"
			},
			textAlign:{
			    type:String,
				default:"center"
			},
			fontSize:{
				type:[Number,String],
				default:32
			},
			isLeft:{
				type:Boolean,
				default:false
			},
			isRight:{
				type:Boolean,
				default:false
			},
			isBack:{
				type:Boolean,
				default:true
			},
			//icon 参数
			iconName:{
				type:String,
				default:"iconfanhui2"
			},
			iconColor:{
				type:String,
				default:"#ffffff"
			},
			iconSize:{
				type:[Number,String],
				default:40
			},
			rightIcon:{
				type:String,
				// default:require("")
			}
		},
		data(){
			return {
				leftIcon:require("../../static/img/back.png")
			}
		},
		mounted(){	
		},
		methods:{
			//返回
			hanldLeft(){
				if(this.isBack){
					uni.navigateBack({
						delta:1
					})
				}else{
					this.$emit('hanldLeft');
				}
			},
			hanldRight(){
				this.$emit('hanldRight');
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* page-header */
	.isFixed{
		position: fixed;
		top: 0;
		left:0;
		right:0;
	}
	.uni-page-head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		// overflow: hidden;
		// border-bottom: 2rpx solid $ztd-color-font;
		z-index: 998;
		background:$ztd-color-primary;
		
		&-title{
			display: inline-block;
			padding: 0 40rpx;
			font-size: 32rpx;
			height: 88rpx;
			line-height: 88rpx; 
			color:$ztd-color-white;
			box-sizing: border-box;
			flex:1;
			// text-align: center;
			position: absolute;
			width:100%;
		}
		
		&-left,&-right{
			min-width:100rpx;
			// height:100%;
			display: flex;
			font-size: 38rpx;
			align-items: center;
			justify-content: center;
			z-index: 999;
		}
		&-right{
			min-width:100rpx;
			font-size: 32rpx;
			// background:#fff;
			position: absolute;
			right:0;
			padding-right: 10rpx;
			
			
			&-info{
				
				&-list{
					font-size:26rpx;
					color:$ztd-color-white;
				}
			}
			// display: flex;
		}
	}
	.uni-page-head-title {
		display: inline-block;
		padding: 0 40rpx;
		font-size: 30rpx;
		height: 88rpx;
		line-height: 88rpx; 
		color:$ztd-color-white;
		box-sizing: border-box;
		/* border-bottom: 2rpx solid #D8D8D8; */
	}
	.uni-page-head-header{
		height:88rpx;
		box-sizing: content-box;
		padding-top:var(--status-bar-height);
		display: flex;
	}
</style>