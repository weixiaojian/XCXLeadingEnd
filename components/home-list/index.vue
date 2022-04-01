<template>
	<view class="home-list-box">
		
		<view class="homelist" v-for="(item,index) in homelist" :key="index">
			<view class="homelist-title">{{item.title}}</view>
			<view class="homelist-item">
				<view class="homelist-item-list thouch" v-for="(list,num) in item.lists" :key="num"  @click="selectItem(list)">
					<uni-badge class="hadge" :text="list.badge" type="error" :inverted="false" size="small"></uni-badge>
					<view class="icon">
						<view class="image-box flex_v_c">
							<image :src="list.src" mode=""></image>
						</view>
						<!-- <i class="iconfont listIcon" v-html="list.icon"></i> -->
					</view>
					<view class="name">{{list.name}}{{item.badge}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"home-list",
		props:{
		  homelist:{
			  type:Array,
			  default:[]
		  }	
		},
		data() {
			return {
				
			};
		},
		methods:{
			selectItem(list){
				this.$emit('selectItem',list);
			}
		}
	}
</script>

<style lang="scss" scoped>

.homelist{
	width: 100%;
	// padding-bottom: 20rpx;
	overflow: hidden;
	
	&-title{
		height: 60rpx;
		padding:0 20rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid $ztd-color-line;
		// font-size:32rpx;
		// font-weight: bold;
	}
	&-item{
		display: flex;
		width: 100%;
		background-color:$ztd-color-white;
		overflow: hidden;
		flex-wrap: wrap;
		padding:4rpx 16rpx;
		border-bottom: 10rpx solid $ztd-color-line;
		&-list{
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 116rpx;
			position: relative;
			.icon{
				// background-color: $ztd-color-back;
				// width: 100%;
				.image-box{
					width: 50rpx;
					height: 54rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.listIcon{
					font-size: 54rpx;
					color: $ztd-color-titlefont;
				}
			}
			.name{
				// margin-top: -12rpx;
				height: 40rpx;
				font-size:24rpx;
				line-height: 40rpx;
				color: $ztd-color-titlefont;
			}
			.hadge{
				z-index: 999;
				position: absolute;
				right:30rpx; 
				top:-4rpx; 
				font-size: 28rpx; 
				padding: 0;
			}
		}
	}
}

</style>
