<template name="buttons">
	<!-- <view style="width: 100%;"> -->
		<view class="m-button thouch" :style="[buttonStyle]" @tap.stop="hanldChange">
			<!-- icon -->
			<view class="m-button-icon" v-if="imageUrl" :style="[iconStyle]">
				<image :src="imageUrl" mode=""></image>
			</view>
			<!-- 字体 -->
			<view class="m-button-text" :style="[textStyle]">{{title}}</view>
		</view>
		
	<!-- </view> -->
</template>

<script>
	export default {
		name:"buttons",
		props:{
			radius:{
			    type:[Number,String],
				default:""
			},
			title:{
				type:[String,Number],
				default:"按钮"
			},
			//按钮icon标题
			imageUrl:{
				type:String
			},
			//按钮宽度
			width:{
				type:[Number,String],
				default:"100%"
			},
			//按钮高度
			height:{
				type:[Number,String],
				default:90
			},
			//按钮背景颜色
			buttonBgColor:{
			    type:String,
				default:""
			},
			//icon大小
			iconSize:{
				type:[String,Number],
				default:"46rpx"
			},
			//icon颜色
			iconColor:{
				type:String,
				default:""
			},
			//字体大小
			fontSize:{
				type:[String,Number],
				default:""
			},
			//字体颜色
			fontColor:{
				type:String,
				default:"#515151"
			},
			buttonborder:{
				type:String
			}
		},
		methods:{
			hanldChange(){
				this.$emit('hanldChange');
			}
		},
		computed:{
			iconStyle(){
				let style = {};
				style.fontSize = this.iconSize;
				if(this.iconColor) style.color = this.iconColor;
				return style;
			},
			textStyle(){
				let style = {};
				if(this.fontSize) style.fontSize = this.fontSize;
				if(this.fontColor) style.color = this.fontColor;
				return style;
			},
			buttonStyle(){
				let style = {};
				style.width = this.width;
				style.height = this.height;
				if(this.buttonBgColor) style.background = this.buttonBgColor;
				if(this.radius) style['border-radius'] = this.radius;
				if(this.buttonborder) style['border'] = this.buttonborder;
				return style;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.m-button{
		width:100%;
		height:90rpx;
		display: flex;
		background: $ztd-color-primary;
		border-radius: $ztd-border-radius;
		align-items: center;
		justify-content: center;
		padding: 0 10rpx;
		
		&-icon{
			// font-size: 40rpx;
			
			padding-right:20rpx;
			display: flex;
			align-items: center;
			
			image{
				width:70rpx;
				height:70rpx;
			}
		}
		&-text{
			margin-top:-2rpx;
			font-size: 28rpx;
			display: flex;
			color:$ztd-color-block;
		}
	}
</style>
