<template>
	<view class="alert-menu">
			<view class="bom-alert-bg">
				<view class="item" v-for="(item,index) in menuList" :key='index' @click="selectItem(item,index)" >
					{{item.name}}
				</view>
				<view class="mg-10"></view>
				<view class="cancel" @click="cancel">
						取消
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		props:{
			menuList:{
				type:Array,
				default:[]
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			selectItem(item,index){
				let self = this;
				let _data = {
					index:index,
					item:item
				}
				self.$emit('selectOperat',_data)
			},
			cancel(){
				let self = this;
				self.$emit('cancel')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.alert-menu{
		width: 100%;
		height: auto;
		.bom-alert-bg{
			width: 100%;
			height: auto;
			text-align: center;
			background: #fff;
			box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.08);
			.item,.cancel{
				font-size:28rpx;
				height: 100rpx;
				line-height: 100rpx;
				border-bottom: 1rpx solid #ededed;
				font-weight: bold;
			}
			.mg-10{
				height: 20rpx;
				background: #F2F2F2;
			}
			
		}
	}
</style>
