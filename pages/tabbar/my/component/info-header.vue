<template name="my-info">
	<view class="myinfo">
		<view class="myinfo-header">
			<view class="myinfo-header-l">
				
				<view class="iconbox">
					<i class="iconfont hicon">&#xe642;</i>
					<!-- <image src="/static/tabbar/my.png" mode=""></image> -->
				</view>
			</view>
			<view class="myinfo-header-c">
				<text style="font-size:34rpx;">{{GET_USERINFO.siteName}}</text>
				<text>{{GET_USERINFO.employeeName}} | {{GET_USERINFO.employeeCode}}</text>
				<text>{{GET_USERINFO.mobilePhone}}</text>
			</view>
			<view class="myinfo-header-r flex_v_c" @tap="logout">
				<i class="iconfont ricon">&#xe655;</i>
				<!-- <image src="/static/img/shoujian.png" mode=""></image> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {GET_USERINFO} from "@/store/gettersType.js";
	import {mapGetters} from "vuex";
	export default {
		data() {
			return {
				
			};
		},
		mounted(){
		},
		computed:{
			...mapGetters([GET_USERINFO])
		},
		methods:{
			logout(){
				this.$emit('logout');
			}
		}
	}
</script>

<style lang="scss" scoped>
	text{
		color: $ztd-color-white;
	}
.myinfo{
	padding-top:var(--status-bar-height);
	width: 100%;
	// height: 300rpx;
	// background-color:$ztd-color-primary;
	padding-left:20rpx;
	padding-right: 20rpx;
	overflow: hidden;
	display: flex;
	box-sizing: border-box;
	&-header{
		width: 100%;
		height: 160rpx;
		// padding: 20rpx 0;
		display: flex;
		// align-items: center;
		// background-color: $ztd-color-white;
		
		&-l{
			width: 160rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconbox{
				width: 100rpx;
				height: 100rpx;
				border:2rpx solid $ztd-color-white;
				// background-color: $ztd-color-white;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				// background-color: ;
				image{
					width: 100%;
					height: 100%;
				}
				.hicon{
					font-size:100rpx;
					color: $ztd-color-white;
				}
			}
			
		}
		
		&-c{
			flex:1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			text{
				height: 46rpx;
				line-height: 46rpx;
			}
		}
		
		&-r{
			width: 90rpx;
			height: 90rpx;
			display: flex;
			padding-top: 20rpx;
			.ricon{
				font-size: 44rpx;
				color: $ztd-color-white;
			}
		}
	}
	
}
</style>
