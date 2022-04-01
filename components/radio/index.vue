<template>
	<!-- 单选框 -->
	<view class="radio">
		<view class="radio-box" @click.stop="selectRadio">
			<view class="radio-box-check">
				<image src="/static/img/radio-check.png" v-if="oncheck"></image>
				<image src="/static/img/check.png" v-else></image>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			oncheck:{
				type:Boolean,
				default:false
			},
			list:{
				type:[String,Object],
				default:""
			},
			index:{
				type:[String,Number],
				default:""
			}
		},
		methods:{
			selectRadio(){
				this.$emit('selectRadio',{list:this.list,index:this.index});
			}
		}
	}
</script>

<style lang="scss" scoped>
.radio{
	// width: 100rpx;
	padding: 0 20rpx 0 10rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&-box{
		// border: 4rpx solid $ztd-color-line;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		
		&-check {
			width:46rpx;
			height:46rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
